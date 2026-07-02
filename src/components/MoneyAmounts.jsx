import { CURRENCIES } from "@/lib/currencies";
import { formatMoney } from "@/lib/format";

// Renders per-currency totals ({ USD: 12, BDT: 900 }) as stacked lines.
// Currencies are independent — amounts are never converted or mixed.
export default function MoneyAmounts({ totals, colorBySign = false }) {
  const lines = CURRENCIES.filter((c) => c.code in totals).map((c) => ({
    code: c.code,
    amount: totals[c.code],
  }));

  if (lines.length === 0) return <span>—</span>;

  return (
    <div className="flex flex-col">
      {lines.map(({ code, amount }) => (
        <span
          key={code}
          className={
            colorBySign ? (amount < 0 ? "text-error" : "text-success") : undefined
          }
        >
          {formatMoney(amount, code)}
        </span>
      ))}
    </div>
  );
}
