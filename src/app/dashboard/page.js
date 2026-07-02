import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { expenseStore, incomeStore } from "@/lib/entries";
import { currentMonth } from "@/lib/format";
import SummaryCards from "@/components/SummaryCards";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";

export const metadata = { title: "Expenses" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const [expenses, incomes] = await Promise.all([
    expenseStore.list(session.user.id),
    incomeStore.list(session.user.id),
  ]);
  const month = currentMonth();
  const monthExpenses = expenses.filter((e) => e.date.startsWith(month));
  const monthIncomes = incomes.filter((e) => e.date.startsWith(month));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">
          Hey, {session.user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="opacity-70">Here&apos;s your spending at a glance.</p>
      </div>

      <SummaryCards monthExpenses={monthExpenses} monthIncomes={monthIncomes} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <EntryList kind="expense" entries={expenses} />
        <div className="space-y-6 lg:order-last">
          <EntryForm kind="expense" />
          <CategoryBreakdown
            kind="expense"
            items={monthExpenses}
            title="This month by category"
          />
        </div>
      </div>
    </div>
  );
}
