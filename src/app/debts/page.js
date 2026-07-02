import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listDebts } from "@/lib/debts";
import { sumByCurrency, today } from "@/lib/format";
import MoneyAmounts from "@/components/MoneyAmounts";
import DebtForm from "@/components/DebtForm";
import DebtList from "@/components/DebtList";

export const metadata = { title: "Debts" };

export default async function DebtsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const debts = await listDebts(session.user.id);
  const open = debts.filter((d) => d.status === "open");
  const youOwe = sumByCurrency(open.filter((d) => d.direction === "iOwe"));
  const owedToYou = sumByCurrency(open.filter((d) => d.direction === "owedToMe"));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Debts</h1>
        <p className="opacity-70">Money you owe and money owed to you.</p>
      </div>

      <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">You owe</div>
          <div className="stat-value text-2xl text-error">
            <MoneyAmounts totals={youOwe} />
          </div>
          <div className="stat-desc">across open debts</div>
        </div>
        <div className="stat">
          <div className="stat-title">Owed to you</div>
          <div className="stat-value text-2xl text-success">
            <MoneyAmounts totals={owedToYou} />
          </div>
          <div className="stat-desc">across open debts</div>
        </div>
        <div className="stat">
          <div className="stat-title">Open debts</div>
          <div className="stat-value text-2xl">{open.length}</div>
          <div className="stat-desc">{debts.length - open.length} settled</div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <DebtList debts={debts} today={today()} />
        <div className="lg:order-last">
          <DebtForm />
        </div>
      </div>
    </div>
  );
}
