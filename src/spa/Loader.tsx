import Image from "next/image";
import beastHappy from "../../public/the-beast.png";

export function LoaderPage() {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen bg-red-100">
      <Image
        priority
        src={beastHappy}
        className="w-32 h-32 animate-spin"
        alt="spinner"
      />
    </div>
  );
}
