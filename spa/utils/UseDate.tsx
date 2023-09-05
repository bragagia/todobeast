import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DayjsDate } from "./PlainDate";

export type Interval = "second" | "minute" | "hour" | number | undefined | null;

const useDate = ({ interval }: { interval?: Interval } = {}) => {
  const [date, setDate] = useState(new DayjsDate());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const bump = () => {
      timeoutId = setTimeout(() => {
        let newDate = new DayjsDate();
        if (!newDate.isSame(date)) setDate(newDate);
        bump();
      }, nextCallback(dayjs().toDate(), interval));
    };

    bump();

    return () => clearTimeout(timeoutId!);
  });

  return date;
};

export default useDate;

export const nextCallback = (now: Date, interval: Interval) => {
  if (typeof interval === "number") {
    return interval;
  } else if (interval === "second") {
    return 1000 - now.getMilliseconds();
  } else if (interval === "minute") {
    return 60 * 1000 - now.getMilliseconds() - now.getSeconds() * 1000;
  } else if (interval === "hour") {
    return (
      60 * 60 * 1000 -
      now.getMilliseconds() -
      now.getSeconds() * 1000 -
      now.getMinutes() * 60 * 1000
    );
  } else {
    return 1000 - now.getMilliseconds();
  }
};
