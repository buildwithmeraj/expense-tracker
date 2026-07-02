"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QUICK = [
  { key: "today", label: "Today", href: "?range=today" },
  { key: "week", label: "This week", href: "?range=week" },
  { key: "month", label: "This month", href: "?" },
];

const MODES = [
  { value: "day", label: "Day" },
  { value: "week-picked", label: "Week" },
  { value: "month-picked", label: "Month" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom range" },
];

// Remount me (via key) when the resolved range changes so defaults stay in
// sync with the URL. `range` is the resolved { key, start, end } from the page.
export default function FilterBar({ range, today }) {
  const router = useRouter();
  const isPicked = MODES.some((m) => m.value === range.key);
  const [mode, setMode] = useState(isPicked ? range.key : "");
  const [from, setFrom] = useState(range.key === "custom" ? range.start : "");
  const [to, setTo] = useState(range.key === "custom" ? range.end : "");

  const apply = (params) =>
    router.replace(`?${new URLSearchParams(params)}`, { scroll: false });

  const applyCustom = (nextFrom, nextTo) => {
    setFrom(nextFrom);
    setTo(nextTo);
    if (nextFrom && nextTo && nextFrom <= nextTo) {
      apply({ range: "custom", from: nextFrom, to: nextTo });
    }
  };

  const year = Number(today.slice(0, 4));
  const years = Array.from({ length: 6 }, (_, i) => String(year - i));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="join">
        {QUICK.map((q) => (
          <Link
            key={q.key}
            href={q.href}
            replace
            scroll={false}
            className={`btn join-item btn-sm ${range.key === q.key ? "btn-primary" : ""}`}
          >
            {q.label}
          </Link>
        ))}
      </div>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="select select-bordered select-sm w-36"
        aria-label="Pick a specific period"
      >
        <option value="" disabled>
          Specific period…
        </option>
        {MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {mode === "day" && (
        <input
          type="date"
          className="input input-bordered input-sm"
          defaultValue={range.key === "day" ? range.start : ""}
          max={today}
          onChange={(e) => e.target.value && apply({ range: "day", d: e.target.value })}
          aria-label="Pick a day"
        />
      )}

      {mode === "week-picked" && (
        <input
          type="date"
          className="input input-bordered input-sm"
          defaultValue={range.key === "week-picked" ? range.start : ""}
          onChange={(e) => e.target.value && apply({ range: "week", d: e.target.value })}
          aria-label="Pick any day of the week"
        />
      )}

      {mode === "month-picked" && (
        <input
          type="month"
          className="input input-bordered input-sm"
          defaultValue={range.key === "month-picked" ? range.start.slice(0, 7) : ""}
          onChange={(e) => e.target.value && apply({ range: "month", d: e.target.value })}
          aria-label="Pick a month"
        />
      )}

      {mode === "year" && (
        <select
          className="select select-bordered select-sm"
          defaultValue={range.key === "year" ? range.start.slice(0, 4) : ""}
          onChange={(e) => e.target.value && apply({ range: "year", d: e.target.value })}
          aria-label="Pick a year"
        >
          <option value="" disabled>
            Year…
          </option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      )}

      {mode === "custom" && (
        <div className="flex items-center gap-1">
          <input
            type="date"
            className="input input-bordered input-sm"
            value={from}
            onChange={(e) => applyCustom(e.target.value, to)}
            aria-label="From date"
          />
          <span className="opacity-60">–</span>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={to}
            min={from || undefined}
            onChange={(e) => applyCustom(from, e.target.value)}
            aria-label="To date"
          />
        </div>
      )}
    </div>
  );
}
