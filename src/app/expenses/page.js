import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { expenseStore, incomeStore } from "@/lib/entries";
import { inRange, monthOf, resolveRange } from "@/lib/dateRange";
import { today } from "@/lib/format";
import SummaryCards from "@/components/SummaryCards";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import AddEntryButton from "@/components/AddEntryButton";
import EntryList from "@/components/EntryList";
import FilterBar from "@/components/FilterBar";
import MonthCalendar from "@/components/MonthCalendar";

export const metadata = { title: "Expenses" };

export default async function ExpensesPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const [params, expenses, incomes] = await Promise.all([
    searchParams,
    expenseStore.list(session.user.id),
    incomeStore.list(session.user.id),
  ]);

  const now = today();
  const range = resolveRange(params, now);
  const viewExpenses = expenses.filter((e) => inRange(e, range));
  const viewIncomes = incomes.filter((e) => inRange(e, range));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="opacity-70">Track and manage your spending.</p>
        </div>
        <AddEntryButton kind="expense" />
      </div>

      <FilterBar key={`${range.key}-${range.start}-${range.end}`} range={range} today={now} />

      <SummaryCards expenses={viewExpenses} incomes={viewIncomes} label={range.label} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <EntryList kind="expense" entries={viewExpenses} periodLabel={range.label} />
        <div className="space-y-6 lg:order-last">
          <MonthCalendar
            items={expenses}
            month={monthOf(range.start)}
            today={now}
            range={range}
          />
          <CategoryBreakdown
            kind="expense"
            items={viewExpenses}
            title={`By category — ${range.label}`}
          />
        </div>
      </div>
    </div>
  );
}
