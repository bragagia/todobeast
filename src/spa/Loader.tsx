import classNames from "classnames";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import beastHappy from "../../public/the-beast.png";

// LoaderPage will act as a infinite loader if no children, and will act as a smooth transition out of loader if children are provided
export function LoaderPage({ children }: { children?: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!children) {
      setVisible(true);
      return;
    }

    setTimeout(() => setVisible(false), 1);
  }, [children]);

  return (
    <>
      <div
        className={classNames(
          "flex flex-row items-center justify-center w-screen h-screen bg-red-100 absolute z-50 transition-opacity duration-300 ease-in-out pointer-events-none",
          { "opacity-100": visible },
          { "opacity-0": !visible }
        )}
      >
        <Image
          priority
          src={beastHappy}
          className={classNames(
            "w-32 h-32",
            { "animate-bounce-h-fast": visible },
            { "animate-bounce-h-fast-out": !visible }
          )}
          alt="spinner"
        />
      </div>

      {children}
    </>
  );
}
