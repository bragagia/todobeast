import Image from "next/image";
import { DayjsDate } from "../../../utils/PlainDate";

import beastHappy from "../../../../../public/beast-happy.png";

export function WeeklyCalendarNavItemBeast({ date }: { date: DayjsDate }) {
  return (
    <div className="flex flex-col items-center gap-1 mr-2">
      <span className="text-xs font-bold text-center text-red-600 whitespace-nowrap">
        Streak 2
      </span>
      <Image src={beastHappy} className="w-8 h-8" alt="" />
    </div>
  );
}
