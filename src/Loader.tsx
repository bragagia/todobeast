import Image from "next/image";
import beastHappy from "../public/beast-happy.png";

export function AppLoader() {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen bg-red-100">
      <Image
        priority
        src={beastHappy}
        className="w-12 h-12 animate-spin"
        alt=""
      />
    </div>
  );
}
