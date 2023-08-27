import { animated, useTransition } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

export function AnimatedTranslate({
  children,
  key,
  direction,
  onRest,
}: {
  children: JSX.Element;
  key: string;
  direction: "next" | "prev" | null;
  onRest: () => void;
}) {
  const itemRef = useRef({ elem: children, key: key });
  const prevCurrent = useRef(itemRef.current);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (key !== itemRef.current.key) {
      prevCurrent.current = itemRef.current;
      itemRef.current = { elem: children, key: key };
      setAnimating(true);
    }
  }, [key, children]);

  const transitions = useTransition(itemRef.current, {
    from: {
      transform: direction
        ? `translateX(${direction === "next" ? 100 : -100}%)`
        : "translateX(0%)",
      opacity: 0,
      zIndex: 0,
    },
    enter: { transform: "translateX(0%)", opacity: 1, zIndex: 1 },
    leave: {
      transform: direction
        ? `translateX(${direction === "next" ? -100 : 100}%)`
        : "translateX(0%)",
      opacity: 0,
      zIndex: 0,
    },
    config: {
      tension: 300,
      friction: 30,
    },
    onRest: () => {
      setAnimating(false);
      onRest();
    },
  });

  return (
    <div key="animation-translation" className="relative w-100">
      {transitions((props, item, state) => (
        <animated.div style={props} className="absolute w-full">
          {item.elem}
        </animated.div>
      ))}
    </div>
  );
}
