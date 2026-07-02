import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { incomeStore } from "@/lib/entries";
import { currentMonth, sumByCurrency } from "@/lib/format";
import MoneyAmounts from "@/components/MoneyAmounts";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";

export const metadata = { title: "Income" };

export default async function IncomePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const incomes = await incomeStore.list(session.user.id);
  const month = currentMonth();
  const monthIncomes = incomes.filter((e) => e.date.startsWith(month));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Income</h1>
        <p className="opacity-70">Everything you&apos;ve earned, in one place.</p>
      </div>

      <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Received this month</div>
          <div className="stat-value text-2xl text-primary">
            <MoneyAmounts totals={sumByCurrency(monthIncomes)} />
          </div>
          <div className="stat-desc">{monthIncomes.length} entries</div>
        </div>
        <div className="stat">
          <div className="stat-title">All time</div>
          <div className="stat-value text-2xl">
            <MoneyAmounts totals={sumByCurrency(incomes)} />
          </div>
          <div className="stat-desc">{incomes.length} entries total</div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <EntryList kind="income" entries={incomes} />
        <div className="space-y-6 lg:order-last">
          <EntryForm kind="income" />
          <CategoryBreakdown
            kind="income"
            items={monthIncomes}
            title="This month by source"
          />
        </div>
      </div>
    </div>
  );
}
