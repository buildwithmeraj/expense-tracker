import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { incomeStore } from "@/lib/entries";
import { inRange, monthOf, resolveRange } from "@/lib/dateRange";
import { sumByCurrency, today } from "@/lib/format";
import MoneyAmounts from "@/components/MoneyAmounts";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import FilterBar from "@/components/FilterBar";
import MonthCalendar from "@/components/MonthCalendar";

export const metadata = { title: "Income" };

export default async function IncomePage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const [params, incomes] = await Promise.all([
    searchParams,
    incomeStore.list(session.user.id),
  ]);

  const now = today();
  const range = resolveRange(params, now);
  const viewIncomes = incomes.filter((e) => inRange(e, range));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Income</h1>
        <p className="opacity-70">Everything you&apos;ve earned, in one place.</p>
      </div>

      <FilterBar key={`${range.key}-${range.start}-${range.end}`} range={range} today={now} />

      <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Received — {range.label}</div>
          <div className="stat-value text-2xl text-primary">
            <MoneyAmounts totals={sumByCurrency(viewIncomes)} />
          </div>
          <div className="stat-desc">{viewIncomes.length} entries</div>
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
        <EntryList kind="income" entries={viewIncomes} periodLabel={range.label} />
        <div className="space-y-6 lg:order-last">
          <EntryForm kind="income" />
          <MonthCalendar
            items={incomes}
            month={monthOf(range.start)}
            today={now}
            range={range}
          />
          <CategoryBreakdown
            kind="income"
            items={viewIncomes}
            title={`By source — ${range.label}`}
          />
        </div>
      </div>
    </div>
  );
}
