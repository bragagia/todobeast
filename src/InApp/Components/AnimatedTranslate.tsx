import { animated, useTransition } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

export function AnimatedTranslate({
  children,
  childKey,
  direction,
}: {
  children: JSX.Element;
  childKey: string;
  direction: "next" | "prev" | null;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef({ elem: children, key: childKey });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (childKey !== itemRef.current.key) {
      itemRef.current = { elem: children, key: childKey };
      setAnimating(true);

      // Add a setTimeout to allow incomingRef to be populated before measuring height
      setTimeout(() => {
        if (parentRef.current && incomingRef.current) {
          const currentChild = parentRef.current.firstChild as HTMLElement;
          const incomingChild = incomingRef.current;
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
    },
  });

  useEffect(() => {
    if (parentRef.current && incomingRef.current) {
      parentRef.current.style.height = `${incomingRef.current.offsetHeight}px`;
    }
  }, []);

  return (
    <div
      ref={parentRef}
      key="animation-translation"
      className="relative w-full overflow-x-hidden"
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
