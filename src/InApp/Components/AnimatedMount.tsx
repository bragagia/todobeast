import { animated, useTransition } from "@react-spring/web";
import { ReactNode, useState } from "react";

export function AnimatedMountArchive({ children }: { children: ReactNode }) {
  const [identifier] = useState(Math.random());

  const transitions = useTransition(identifier, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {
      tension: 300,
      friction: 35,
    },
  });

  return transitions((style, item) => (
    <animated.div style={style}>{children}</animated.div>
  ));
}
