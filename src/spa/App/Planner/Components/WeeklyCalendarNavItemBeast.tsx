import Image from "next/image";
import { DayjsDate } from "../../../utils/PlainDate";

import beastHappy from "../../../../../public/the-beast.png";

export function WeeklyCalendarNavItemBeast({ date }: { date: DayjsDate }) {
  return (
    <div className="flex flex-col items-center mr-2">
      <span
        className="text-xs font-bold text-center text-red-600 whitespace-nowrap dark:text-red-500 hidden" // TODO:
      >
        Streak 2
      </span>
      <Image src={beastHappy} className="w-12 h-12" alt="" />
    </div>
  );
}
