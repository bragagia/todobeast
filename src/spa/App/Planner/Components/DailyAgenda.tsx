export function DailyAgenda() {
  const startHour = 9;
  const endHour = 22;

  return (
    <div>
      <div className="flex-col m-2 pt-2">
        {Array.from(
          { length: endHour - startHour + 1 },
          (v, i) => i + startHour
        ).map((hour, i) => (
          <div key={i} className="h-16 w-full flex flex-row">
            <div className="w-12">
              <div className="-translate-y-1/2 text-xs font-bold w-full text-right pr-1">
                {hour}:00
              </div>
            </div>

            <div className="self-stretch w-full border-t border-gray-200">
              {Array.from({ length: 4 }, (v, i) => i * 15).map((minutes, i) => (
                <div
                  key={i}
                  className="h-4 border-b border-gray-100 w-full px-1"
                >
                  <div className="relative h-16 hover:bg-white hover:border hover:border-gray-300 hover:shadow-md w-full rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
