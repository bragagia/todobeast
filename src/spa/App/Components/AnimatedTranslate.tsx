import { animated, useTransition } from "@react-spring/web";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 Animated translate need a comparable childkey to know the direction to which the translation must take place.
*/
export function AnimatedTranslate({
  children,
  childKey,
}: {
  children: JSX.Element;
  childKey: string;
}) {
  //
  const [currentChild, setCurrentChild] = useState({
    elem: children,
    key: childKey,
  });
  const [previousChild, setPreviousChild] = useState({
    elem: children,
    key: childKey,
  });

  // Styling status
  let [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  const childRef = useRef<HTMLDivElement>(null);
  const [incomingChildHeight, setIncomingChildHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  const transitions = useTransition([currentChild], {
    initial: { transform: "translateX(0%)", opacity: 1 },

    from: {
      transform: direction
        ? `translateX(${direction === "next" ? 100 : -100}%)`
        : "translateX(0%)",
      opacity: 0,
    },

    enter: { transform: "translateX(0%)", opacity: 1 },

    leave: {
      transform: direction
        ? `translateX(${direction === "next" ? -100 : 100}%)`
        : "translateX(0%)",
      opacity: 0,
    },

    config: {
      tension: 500,
      friction: 40,
    },

    onDestroyed(item: { elem: JSX.Element; key: string }) {
      // We keep in memory previous child, because onDestroyed is called for every destroyed child, so we want to make sure the destroyed item is the last one == when the animation really stop
      if (item.key === previousChild.key) {
        // Uses because if child change before transition ends, onRest is called. With animating as a number, it will be incremented to 2 and then reset to 0 at the very end
        setAnimating(false);

        // Reset the height to the current child after the transition ends.
        setParentHeight(incomingChildHeight);
      }
      return;
    },
  });

  const calculateHeight = useCallback(() => {
    if (childRef.current) {
      const incomingChild = childRef.current;

      // Set parent height to max of both child during transition
      const maxChildHeight = Math.max(parentHeight, incomingChild.offsetHeight);
      setParentHeight(maxChildHeight);

      // Set incoming child height so we can reset parent height to its height when animation ends
      setIncomingChildHeight(incomingChild.offsetHeight);
    }
  }, [childRef, parentHeight]);

  useEffect(() => {
    if (childKey !== currentChild.key) {
      setDirection(childKey < currentChild.key ? "prev" : "next");
      setAnimating(true);

      setPreviousChild(currentChild);
      setCurrentChild({ elem: children, key: childKey });
    }

    // Add a setTimeout to allow childRef and parentRef to be populated before measuring height
    setTimeout(() => {
      calculateHeight();
    }, 0);
  }, [childKey, children, calculateHeight, currentChild]);

  // Used to recalculate height on every frame when animating
  useEffect(() => {
    let rafId: number;

    if (animating) {
      const updateHeight = () => {
        calculateHeight();

        // Schedule the next height update
        rafId = requestAnimationFrame(updateHeight);
      };

      // Start the height update loop
      rafId = requestAnimationFrame(updateHeight);
    }

    return () => {
      // Clean up the loop when the component unmounts or when `animating` changes
      cancelAnimationFrame(rafId);
    };
  }, [animating, calculateHeight]);

  if (!animating && childKey !== currentChild.key) {
    animating = true;
  }

  // If animating or if a new child as just been mounted, render transition instead of direct child
  return (
    <div
      className={classNames("w-full", {
        "relative overflow-hidden": animating,
      })}
      style={animating ? { height: `${parentHeight}px` } : {}}
    >
      {transitions((props, item, state) => (
        <animated.div
          key={item.key}
          id={item.key}
          ref={childRef}
          style={animating ? props : { transform: "none" }}
          className={classNames("w-full", { absolute: animating })}
        >
          {item.key === childKey ? children : item.elem}
        </animated.div>
      ))}
    </div>
  );
}
