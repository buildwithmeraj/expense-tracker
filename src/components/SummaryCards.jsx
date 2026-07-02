import { diffTotals, sumByCurrency } from "@/lib/format";
import MoneyAmounts from "./MoneyAmounts";

export default function SummaryCards({ monthExpenses, monthIncomes }) {
  const spent = sumByCurrency(monthExpenses);
  const received = sumByCurrency(monthIncomes);
  const balance = diffTotals(received, spent);

  return (
    <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Spent this month</div>
        <div className="stat-value text-2xl text-primary">
          <MoneyAmounts totals={spent} />
        </div>
        <div className="stat-desc">{monthExpenses.length} expenses</div>
      </div>
      <div className="stat">
        <div className="stat-title">Income this month</div>
        <div className="stat-value text-2xl">
          <MoneyAmounts totals={received} />
        </div>
        <div className="stat-desc">{monthIncomes.length} entries</div>
      </div>
      <div className="stat">
        <div className="stat-title">Balance</div>
        <div className="stat-value text-2xl">
          <MoneyAmounts totals={balance} colorBySign />
        </div>
        <div className="stat-desc">income − expenses, per currency</div>
      </div>
    </div>
  );
}
