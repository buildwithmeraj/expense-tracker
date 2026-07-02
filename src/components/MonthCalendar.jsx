import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { CURRENCIES } from "@/lib/currencies";
import {
  addDays,
  addMonths,
  fmtMonthLabel,
  monthBounds,
  startOfWeek,
} from "@/lib/dateRange";
import { compactMoney } from "@/lib/format";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// Month grid with per-day totals. Clicking a day filters the page to it;
// the arrows move (and filter to) the previous/next month.
export default function MonthCalendar({ items, month, today, range }) {
  const { start, end } = monthBounds(month);

  const totals = {};
  for (const item of items) {
    if (item.date < start || item.date > end) continue;
    (totals[item.date] ??= {})[item.currency] =
      (totals[item.date]?.[item.currency] ?? 0) + item.amount;
  }

  // Build the visible grid: full weeks covering the month.
  const days = [];
  for (let d = startOfWeek(start); d <= end || days.length % 7 !== 0; d = addDays(d, 1)) {
    days.push(d);
  }

  // Tinting every cell says nothing when the filter spans the whole month.
  const highlightSelection = !(range.start <= start && range.end >= end);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-2 p-4">
        <div className="flex items-center justify-between">
          <Link
            href={`?range=month&d=${addMonths(month, -1)}`}
            replace
            scroll={false}
            className="btn btn-ghost btn-square btn-xs"
            aria-label="Previous month"
          >
            <IconChevronLeft size={16} aria-hidden="true" />
          </Link>
          <span className="text-sm font-semibold">{fmtMonthLabel(month)}</span>
          <Link
            href={`?range=month&d=${addMonths(month, 1)}`}
            replace
            scroll={false}
            className="btn btn-ghost btn-square btn-xs"
            aria-label="Next month"
          >
            <IconChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-[10px] font-semibold uppercase opacity-50">
              {w}
            </span>
          ))}
          {days.map((day) => {
            if (day < start || day > end) {
              return <span key={day} aria-hidden="true" />;
            }
            const dayTotals = totals[day];
            const inSelection =
              highlightSelection && day >= range.start && day <= range.end;
            const isToday = day === today;
            return (
              <Link
                key={day}
                href={`?range=day&d=${day}`}
                replace
                scroll={false}
                className={[
                  "flex min-h-11 flex-col items-center rounded-field p-0.5 text-xs hover:bg-base-200",
                  inSelection ? "bg-primary/10" : "",
                  isToday ? "ring-1 ring-primary" : "",
                ].join(" ")}
              >
                <span className={dayTotals ? "font-bold" : "opacity-60"}>
                  {Number(day.slice(8))}
                </span>
                {dayTotals &&
                  CURRENCIES.filter((c) => c.code in dayTotals).map((c) => (
                    <span key={c.code} className="text-[9px] leading-tight text-primary">
                      {compactMoney(dayTotals[c.code], c.code)}
                    </span>
                  ))}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
