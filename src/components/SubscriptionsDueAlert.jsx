import Link from "next/link";
import { IconBellRinging, IconChevronDown } from "@tabler/icons-react";
import { markSubscriptionPaid, snoozeSubscription } from "@/app/actions";
import { formatDate, formatMoney } from "@/lib/format";

const SNOOZE_OPTIONS = [
  { days: 1, label: "1 day" },
  { days: 3, label: "3 days" },
  { days: 7, label: "1 week" },
];

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
              <span className="ml-auto flex items-center gap-1">
                <form action={markSubscriptionPaid}>
                  <input type="hidden" name="id" value={subscription.id} />
                  <button type="submit" className="btn btn-outline btn-xs">
                    Mark paid
                  </button>
                </form>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-outline btn-xs">
                    Snooze
                    <IconChevronDown size={12} aria-hidden="true" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu z-40 mt-1 w-32 rounded-box bg-base-100 p-1 text-base-content shadow-lg"
                  >
                    {SNOOZE_OPTIONS.map(({ days, label }) => (
                      <li key={days}>
                        <form action={snoozeSubscription}>
                          <input type="hidden" name="id" value={subscription.id} />
                          <input type="hidden" name="days" value={days} />
                          <button type="submit" className="w-full text-left">
                            {label}
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </div>
              </span>
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
