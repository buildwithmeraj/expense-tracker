import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listSubscriptions, needsAttention } from "@/lib/subscriptions";
import { addDays } from "@/lib/dateRange";
import { sumByCurrency, today } from "@/lib/format";
import MoneyAmounts from "@/components/MoneyAmounts";
import AddSubscriptionButton from "@/components/AddSubscriptionButton";
import SubscriptionList from "@/components/SubscriptionList";
import SubscriptionsDueAlert from "@/components/SubscriptionsDueAlert";

export const metadata = { title: "Subscriptions" };

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const subscriptions = await listSubscriptions(session.user.id);
  const now = today();
  const dueSoonEnd = addDays(now, 7);
  const due = subscriptions.filter((s) => needsAttention(s, now, dueSoonEnd));
  const monthly = subscriptions.filter((s) => s.cycle === "monthly");
  const yearly = subscriptions.filter((s) => s.cycle === "yearly");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="opacity-70">
            Recurring bills — get an alert before each one is due, and log it as an
            expense with one click.
          </p>
        </div>
        <AddSubscriptionButton />
      </div>

      <SubscriptionsDueAlert due={due} today={now} showManageLink={false} />

      <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Monthly plans</div>
          <div className="stat-value text-2xl text-primary">
            <MoneyAmounts totals={sumByCurrency(monthly)} />
          </div>
          <div className="stat-desc">{monthly.length} subscriptions / month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Yearly plans</div>
          <div className="stat-value text-2xl">
            <MoneyAmounts totals={sumByCurrency(yearly)} />
          </div>
          <div className="stat-desc">{yearly.length} subscriptions / year</div>
        </div>
        <div className="stat">
          <div className="stat-title">Needs attention</div>
          <div className="stat-value text-2xl">{due.length}</div>
          <div className="stat-desc">due within 7 days or overdue</div>
        </div>
      </div>

      <SubscriptionList subscriptions={subscriptions} today={now} dueSoonEnd={dueSoonEnd} />
    </div>
  );
}
