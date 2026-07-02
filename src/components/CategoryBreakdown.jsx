import { getCategory } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";
import { formatMoney } from "@/lib/format";

// Per-currency sections: amounts in different currencies are never mixed,
// so progress bars only compare within one currency.
export default function CategoryBreakdown({ kind, items, title }) {
  const sections = CURRENCIES.map((currency) => {
    const byCategory = {};
    for (const item of items) {
      if (item.currency !== currency.code) continue;
      byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount;
    }
    const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    return { currency, entries, max: entries[0]?.[1] ?? 0 };
  }).filter((s) => s.entries.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <h2 className="card-title text-base">{title}</h2>
        {sections.map(({ currency, entries, max }) => (
          <div key={currency.code} className="flex flex-col gap-3">
            {sections.length > 1 && (
              <div className="text-xs font-semibold uppercase opacity-60">
                {currency.label} ({currency.symbol})
              </div>
            )}
            {entries.map(([value, total]) => {
              const category = getCategory(kind, value);
              const CategoryIcon = category.icon;
              return (
                <div key={value}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <CategoryIcon size={16} className="opacity-70" aria-hidden="true" />
                      {category.label}
                    </span>
                    <span className="font-medium">{formatMoney(total, currency.code)}</span>
                  </div>
                  <progress className="progress progress-secondary" value={total} max={max} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
