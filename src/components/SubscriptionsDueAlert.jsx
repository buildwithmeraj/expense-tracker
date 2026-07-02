import Link from "next/link";
import { IconBellRinging } from "@tabler/icons-react";
import { markSubscriptionPaid } from "@/app/actions";
import { formatDate, formatMoney } from "@/lib/format";

// Warning banner listing due/overdue subscriptions. Each stays here until
// its "Mark paid" is clicked (which logs the expense and advances the date).
export default function SubscriptionsDueAlert({ due, today, showManageLink = true }) {
  if (due.length === 0) return null;

  return (
    <div role="alert" className="alert alert-warning items-start">
      <IconBellRinging size={20} aria-hidden="true" className="mt-0.5" />
      <div className="flex w-full flex-col gap-2">
        <span className="font-bold">
          {due.length === 1
            ? "1 subscription needs attention"
            : `${due.length} subscriptions need attention`}
        </span>
        <ul className="flex flex-col gap-1.5">
          {due.map((subscription) => (
            <li key={subscription.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium">{subscription.name}</span>
              <span>
                — {formatMoney(subscription.amount, subscription.currency)} ·{" "}
                {subscription.nextDue < today
                  ? `was due ${formatDate(subscription.nextDue)}`
                  : `due ${formatDate(subscription.nextDue)}`}
              </span>
              <form action={markSubscriptionPaid} className="ml-auto">
                <input type="hidden" name="id" value={subscription.id} />
                <button type="submit" className="btn btn-outline btn-xs">
                  Mark paid
                </button>
              </form>
            </li>
          ))}
        </ul>
        {showManageLink && (
          <Link href="/subscriptions" className="link text-sm">
            Manage subscriptions
          </Link>
        )}
      </div>
    </div>
  );
}
