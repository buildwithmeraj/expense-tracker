"use client";

import { useState } from "react";
import { IconCheck, IconPencil, IconRepeat, IconTrash } from "@tabler/icons-react";
import { deleteSubscription, markSubscriptionPaid, updateSubscription } from "@/app/actions";
import { getCategory } from "@/lib/categories";
import { formatDate, formatMoney } from "@/lib/format";
import SubscriptionDialog from "./SubscriptionDialog";

export default function SubscriptionList({ subscriptions, today, dueSoonEnd }) {
  const [editing, setEditing] = useState(null);

  if (subscriptions.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center py-16 text-center">
          <IconRepeat size={40} className="opacity-40" aria-hidden="true" />
          <h2 className="card-title">No subscriptions yet</h2>
          <p className="opacity-70">
            Track recurring bills like Netflix or hosting, and get reminded before
            they&apos;re due.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-0 sm:p-2">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Subscription</th>
                <th className="hidden sm:table-cell">Cycle</th>
                <th>Next due</th>
                <th className="text-right">Amount</th>
                <th className="w-28" />
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => {
                const category = getCategory("expense", subscription.category);
                const CategoryIcon = category.icon;
                const overdue = subscription.nextDue < today;
                const dueSoon = !overdue && subscription.nextDue <= dueSoonEnd;
                return (
                  <tr key={subscription.id} className="hover">
                    <td>
                      <div className="font-medium">{subscription.name}</div>
                      <div className="flex items-center gap-1 text-xs opacity-60">
                        <CategoryIcon size={12} aria-hidden="true" />
                        {category.label}
                        <span className="sm:hidden"> · {subscription.cycle}</span>
                      </div>
                      {subscription.note && (
                        <div className="max-w-52 truncate text-xs opacity-60">
                          {subscription.note}
                        </div>
                      )}
                    </td>
                    <td className="hidden capitalize sm:table-cell">{subscription.cycle}</td>
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {formatDate(subscription.nextDue)}
                        {overdue && <span className="badge badge-error badge-sm">Overdue</span>}
                        {dueSoon && <span className="badge badge-warning badge-sm">Due soon</span>}
                      </div>
                    </td>
                    <td className="text-right font-semibold whitespace-nowrap">
                      {formatMoney(subscription.amount, subscription.currency)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <form action={markSubscriptionPaid}>
                          <input type="hidden" name="id" value={subscription.id} />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-square btn-xs text-success"
                            aria-label={`Mark ${subscription.name} paid`}
                            title="Mark paid — logs an expense and moves the due date forward"
                          >
                            <IconCheck size={16} aria-hidden="true" />
                          </button>
                        </form>
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-xs"
                          aria-label={`Edit ${subscription.name}`}
                          onClick={() => setEditing(subscription)}
                        >
                          <IconPencil size={16} aria-hidden="true" />
                        </button>
                        <form
                          action={deleteSubscription}
                          onSubmit={(e) => {
                            if (!confirm(`Delete "${subscription.name}"?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={subscription.id} />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-square btn-xs text-error"
                            aria-label={`Delete ${subscription.name}`}
                          >
                            <IconTrash size={16} aria-hidden="true" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <SubscriptionDialog
          key={editing.id}
          action={updateSubscription}
          title="Edit subscription"
          submitLabel="Save changes"
          defaults={editing}
          subscriptionId={editing.id}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
