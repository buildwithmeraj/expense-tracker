// First entry is the default for new entries and leads per-currency displays.
export const CURRENCIES = [
  { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

export const DEFAULT_CURRENCY = CURRENCIES[0].code;

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}
