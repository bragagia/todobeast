import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(isoWeek);

export class DayjsDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  constructor(year: number, month: number, day: number);
  constructor(year: string, month: string, day: string);
  constructor(dateString: string);
  constructor(dayjsDate: dayjs.Dayjs);
  constructor();
  constructor(
    yearOrMonthOrDateString?: number | string | dayjs.Dayjs,
    monthOrDay?: number | string,
    day?: number | string
  ) {
    let date: dayjs.Dayjs;
    if (dayjs.isDayjs(yearOrMonthOrDateString)) {
      date = dayjs(yearOrMonthOrDateString.format("YYYY-MM-DD"));
    } else if (
      typeof yearOrMonthOrDateString === "string" &&
      monthOrDay === undefined &&
      day === undefined
    ) {
      date = dayjs(yearOrMonthOrDateString);
    } else if (
      yearOrMonthOrDateString !== undefined &&
      monthOrDay !== undefined &&
      day !== undefined
    ) {
      date = dayjs(`${yearOrMonthOrDateString}-${monthOrDay}-${day}`);
    } else {
      date = dayjs();
    }
    this.year = date.year();
    this.month = date.month() + 1;
    this.day = date.date();
  }

  toDayjs(): dayjs.Dayjs {
    return dayjs()
      .year(this.year)
      .month(this.month - 1)
      .date(this.day)
      .startOf("day");
  }

  toString(separator: string = "-"): string {
    return this.toDayjs().format(`YYYY${separator}MM${separator}DD`);
  }

  format(template: string): string {
    return this.toDayjs().format(template);
  }

  addDays(days: number): DayjsDate {
    const date = this.toDayjs().add(days, "day");
    return new DayjsDate(date.year(), date.month() + 1, date.date());
  }

  startOfWeek(): DayjsDate {
    const date = this.toDayjs().startOf("isoWeek");
    return new DayjsDate(date.year(), date.month() + 1, date.date());
  }

  startOfMonth(): DayjsDate {
    const date = this.toDayjs().startOf("month");
    return new DayjsDate(date.year(), date.month() + 1, date.date());
  }

  isSame(other: DayjsDate): boolean {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }

  isBefore(other: DayjsDate): boolean {
    if (this.year < other.year) {
      return true;
    } else if (this.year > other.year) {
      return false;
    }
    if (this.month < other.month) {
      return true;
    } else if (this.month > other.month) {
      return false;
    }
    return this.day < other.day;
  }

  isAfter(other: DayjsDate): boolean {
    return !this.isBefore(other) && !this.isSame(other);
  }

  Year(): number {
    return this.year;
  }

  Month(): number {
    return this.month;
  }

  Day(): number {
    return this.day;
  }
}
