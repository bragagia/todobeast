import { Dayjs } from "dayjs";

export function areSameDay(a: Dayjs, b: Dayjs) {
  a = a.startOf("day");
  b = b.startOf("day");

  return a.isSame(b);
}
