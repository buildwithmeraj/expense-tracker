import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/format";

export default function SummaryCards({ expenses, monthExpenses }) {
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const allTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  for (const e of monthExpenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  }
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategory = top ? getCategory(top[0]) : null;
  const TopIcon = topCategory?.icon;

  return (
    <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Spent this month</div>
        <div className="stat-value text-primary">{formatMoney(monthTotal)}</div>
        <div className="stat-desc">{monthExpenses.length} expenses</div>
      </div>
      <div className="stat">
        <div className="stat-title">All time</div>
        <div className="stat-value">{formatMoney(allTotal)}</div>
        <div className="stat-desc">{expenses.length} expenses total</div>
      </div>
      <div className="stat">
        <div className="stat-title">Top category</div>
        <div className="stat-value flex items-center gap-2 text-2xl text-accent">
          {topCategory ? (
            <>
              <TopIcon size={26} aria-hidden="true" />
              {topCategory.label}
            </>
          ) : (
            "—"
          )}
        </div>
        <div className="stat-desc">
          {top ? `${formatMoney(top[1])} this month` : "Nothing spent yet"}
        </div>
      </div>
    </div>
  );
}
