import { getCurrency } from "./currencies";

// Fixed locale so server- and client-rendered output always match.
// Currency symbols are applied manually — Intl's symbol choice for BDT
// varies across ICU builds, which would cause hydration mismatches.
const number = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(amount, currency = "USD") {
  const { symbol } = getCurrency(currency);
  return amount < 0
    ? `-${symbol}${number.format(-amount)}`
    : `${symbol}${number.format(amount)}`;
}

// `date` is a YYYY-MM-DD string; parse it as local time, not UTC.
export function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function today() {
  const now = new Date();
  return `${currentMonth()}-${String(now.getDate()).padStart(2, "0")}`;
}

// { USD: 120, BDT: 4500 } — only currencies that actually appear get a key.
export function sumByCurrency(items) {
  const totals = {};
  for (const item of items) {
    totals[item.currency] = (totals[item.currency] ?? 0) + item.amount;
  }
  return totals;
}

// a − b per currency; keeps keys present on either side (so a 0 balance
// from equal income/spend still renders as 0 rather than disappearing).
export function diffTotals(a, b) {
  const out = { ...a };
  for (const [code, value] of Object.entries(b)) {
    out[code] = (out[code] ?? 0) - value;
  }
  return out;
}
