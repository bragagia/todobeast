import { animated, useTransition } from "@react-spring/web";
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
  const parentRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef({ elem: children, key: childKey });
  const [animating, setAnimating] = useState(false); // Used to force re-rendering
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  useEffect(() => {
    if (childKey !== itemRef.current.key) {
      setDirection(childKey < itemRef.current.key ? "prev" : "next");

      itemRef.current = { elem: children, key: childKey };

      setAnimating(true);

      // Add a setTimeout to allow incomingRef to be populated before measuring height
      setTimeout(() => {
        if (parentRef.current && incomingRef.current) {
          const currentChild = parentRef.current.firstChild as HTMLElement;
          const incomingChild = incomingRef.current;

          // Set parent height to max of both child during transition
          const maxChildHeight = Math.max(
            currentChild.offsetHeight,
            incomingChild.offsetHeight
          );
          parentRef.current.style.height = `${maxChildHeight}px`;
        }
      }, 0);
    }
  }, [childKey, children]);

  const transitions = useTransition([itemRef.current], {
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

    onRest: () => {
      setAnimating(false);

      // Set the height to the incoming child after the transition ends.
      if (parentRef.current && incomingRef.current) {
        parentRef.current.style.height = `${incomingRef.current.offsetHeight}px`;
      }
    },
  });

  useEffect(() => {
    // set parent height at mount
    if (parentRef.current && incomingRef.current) {
      parentRef.current.style.height = `${incomingRef.current.offsetHeight}px`;
    }
  }, []);

  return (
    <div
      ref={parentRef}
      key="animation-translation"
      className="relative w-full overflow-hidden"
    >
      {transitions((props, item, state) => (
        <animated.div
          ref={incomingRef}
          style={props}
          className="absolute w-full"
        >
          {item.elem}
        </animated.div>
      ))}
    </div>
  );
}
