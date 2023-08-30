import { animated, useTransition } from "@react-spring/web";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

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
  const childRef = useRef<HTMLDivElement>(null);
  const [currentChild, setCurrentChild] = useState({
    elem: children,
    key: childKey,
  });
  const [animating, setAnimating] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [parentHeight, setParentHeight] = useState(0);

  const transitions = useTransition([currentChild], {
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
      tension: 550,
      friction: 40,
    },

    onRest: () => {
      // Uses because if child change before transition ends, onRest is called. With animating as a number, it will be incremented to 2 and then reset to 0 at the very end
      setAnimating(Math.max(animating - 1, 0));

      // Reset the height to the current child after the transition ends.
      if (childRef.current) {
        setParentHeight(childRef.current.offsetHeight);
      }
    },
  });

  function calculateHeight() {
    if (childRef.current) {
      const incomingChild = childRef.current;

      // Set parent height to max of both child during transition
      const maxChildHeight = Math.max(parentHeight, incomingChild.offsetHeight);
      setParentHeight(maxChildHeight);
    }
  }

  useEffect(() => {
    if (childKey !== currentChild.key) {
      setDirection(childKey < currentChild.key ? "prev" : "next");
      setAnimating(animating + 1);

      setCurrentChild({ elem: children, key: childKey });

      // Add a setTimeout to allow childRef and parentRef to be populated before measuring height
      setTimeout(() => {
        calculateHeight();
      }, 0);
    }
  }, [childKey, children]);

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
  }, [animating]);

  // If animating or if a new child as just been mounted, render transition instead of direct child
  return (
    <div
      key="animating-div"
      className={classNames("w-full", {
        "relative overflow-hidden": animating > 0,
      })}
      style={animating > 0 ? { height: `${parentHeight}px` } : {}}
    >
      {transitions((props, item, state) => (
        <animated.div
          key={item.key}
          id={item.key}
          ref={childRef}
          style={props}
          className={classNames("w-full", { absolute: animating > 0 })}
        >
          {item.key == childKey ? children : item.elem}
        </animated.div>
      ))}
    </div>
  );
}
