export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
];

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}
