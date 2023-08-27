import { animated, useTransition } from "@react-spring/web";
import { ReactNode, useState } from "react";

export function AnimatedMount({ children }: { children: ReactNode }) {
  const [identifier] = useState(Math.random());

  const transitions = useTransition(identifier, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
  });

  return transitions((style, item) => (
    <animated.div style={style}>{children}</animated.div>
  ));
}
