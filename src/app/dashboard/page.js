import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getExpenses } from "@/lib/expenses";
import { currentMonth } from "@/lib/format";
import SummaryCards from "@/components/SummaryCards";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const expenses = await getExpenses(session.user.id);
  const month = currentMonth();
  const monthExpenses = expenses.filter((e) => e.date.startsWith(month));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">
          Hey, {session.user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="opacity-70">Here&apos;s your spending at a glance.</p>
      </div>

      <SummaryCards expenses={expenses} monthExpenses={monthExpenses} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ExpenseList expenses={expenses} />
        <div className="space-y-6 lg:order-last">
          <ExpenseForm />
          <CategoryBreakdown monthExpenses={monthExpenses} />
        </div>
      </div>
    </div>
  );
}
