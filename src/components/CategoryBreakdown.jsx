import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/format";

export default function CategoryBreakdown({ monthExpenses }) {
  const byCategory = {};
  for (const e of monthExpenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  }
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 0;

  if (entries.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <h2 className="card-title text-base">This month by category</h2>
        {entries.map(([value, total]) => {
          const category = getCategory(value);
          const CategoryIcon = category.icon;
          return (
            <div key={value}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <CategoryIcon size={16} className="opacity-70" aria-hidden="true" />
                  {category.label}
                </span>
                <span className="font-medium">{formatMoney(total)}</span>
              </div>
              <progress className="progress progress-secondary" value={total} max={max} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
