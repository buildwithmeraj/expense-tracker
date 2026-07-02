// All dates are local-time YYYY-MM-DD strings; ISO string comparison
// doubles as date comparison.

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const YEAR_RE = /^\d{4}$/;

const toDate = (s) => new Date(`${s}T00:00:00`);

const toStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export function addDays(day, n) {
  const d = toDate(day);
  d.setDate(d.getDate() + n);
  return toStr(d);
}

// Weeks start on Monday; change the offset here if you prefer Sunday.
export function startOfWeek(day) {
  const d = toDate(day);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return toStr(d);
}

export const monthOf = (day) => day.slice(0, 7);

export function monthBounds(ym) {
  const [y, m] = ym.split("-").map(Number);
  return { start: `${ym}-01`, end: toStr(new Date(y, m, 0)) };
}

export function addMonths(ym, n) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const fmtDay = (day) =>
  toDate(day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const fmtMonthLabel = (ym) =>
  toDate(`${ym}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

// Turns ?range=…&d=…&from=…&to=… into { key, start, end, label }.
// Anything malformed falls back to the default: this month.
export function resolveRange(searchParams, today) {
  const get = (k) => (typeof searchParams?.[k] === "string" ? searchParams[k] : "");
  const range = get("range");
  const d = get("d");

  switch (range) {
    case "today":
      return { key: "today", start: today, end: today, label: "Today" };

    case "day":
      if (DAY_RE.test(d)) {
        return { key: "day", start: d, end: d, label: fmtDay(d) };
      }
      break;

    case "week": {
      const picked = DAY_RE.test(d);
      const start = startOfWeek(picked ? d : today);
      const end = addDays(start, 6);
      return picked
        ? { key: "week-picked", start, end, label: `Week of ${fmtDay(start)}` }
        : { key: "week", start, end, label: "This week" };
    }

    case "month":
      if (MONTH_RE.test(d)) {
        return { key: "month-picked", ...monthBounds(d), label: fmtMonthLabel(d) };
      }
      break;

    case "year":
      if (YEAR_RE.test(d)) {
        return { key: "year", start: `${d}-01-01`, end: `${d}-12-31`, label: d };
      }
      break;

    case "custom": {
      const from = get("from");
      const to = get("to");
      if (DAY_RE.test(from) && DAY_RE.test(to) && from <= to) {
        return {
          key: "custom",
          start: from,
          end: to,
          label: `${fmtDay(from)} – ${fmtDay(to)}`,
        };
      }
      break;
    }
  }

  return { key: "month", ...monthBounds(monthOf(today)), label: "This month" };
}

export const inRange = (item, range) =>
  item.date >= range.start && item.date <= range.end;
