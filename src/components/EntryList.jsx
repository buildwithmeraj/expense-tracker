"use client";

import { useState } from "react";
import { IconPencil, IconReceipt, IconTrash } from "@tabler/icons-react";
import {
  deleteExpense,
  deleteIncome,
  updateExpense,
  updateIncome,
} from "@/app/actions";
import { getCategory } from "@/lib/categories";
import { formatDate, formatMoney } from "@/lib/format";
import EntryDialog from "./EntryDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const KIND_CONFIG = {
  expense: { update: updateExpense, remove: deleteExpense, noun: "expense" },
  income: { update: updateIncome, remove: deleteIncome, noun: "income" },
};

export default function EntryList({ kind, entries, periodLabel }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { update, remove, noun } = KIND_CONFIG[kind];

  if (entries.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center py-16 text-center">
          <IconReceipt size={40} className="opacity-40" aria-hidden="true" />
          <h2 className="card-title">No {noun}s found</h2>
          <p className="opacity-70">
            {periodLabel
              ? `Nothing recorded for “${periodLabel}”. Add one or pick another period.`
              : `Add your first ${noun} to start tracking.`}
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
                <th className="capitalize">{noun}</th>
                <th className="hidden sm:table-cell">
                  {kind === "income" ? "Source" : "Category"}
                </th>
                <th className="hidden sm:table-cell">Date</th>
                <th className="text-right">Amount</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const category = getCategory(kind, entry.category);
                const CategoryIcon = category.icon;
                return (
                  <tr key={entry.id} className="hover">
                    <td>
                      <div className="font-medium">{entry.title}</div>
                      <div className="flex items-center gap-1 text-xs opacity-60 sm:hidden">
                        <CategoryIcon size={12} aria-hidden="true" />
                        {formatDate(entry.date)}
                      </div>
                      {entry.note && (
                        <div className="max-w-52 truncate text-xs opacity-60">{entry.note}</div>
                      )}
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="badge badge-secondary badge-outline gap-1 whitespace-nowrap">
                        <CategoryIcon size={12} aria-hidden="true" />
                        {category.label}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap sm:table-cell">
                      {formatDate(entry.date)}
                    </td>
                    <td className="text-right font-semibold whitespace-nowrap">
                      {formatMoney(entry.amount, entry.currency)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-xs"
                          aria-label={`Edit ${entry.title}`}
                          onClick={() => setEditing(entry)}
                        >
                          <IconPencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-xs text-error"
                          aria-label={`Delete ${entry.title}`}
                          onClick={() => setDeleting(entry)}
                        >
                          <IconTrash size={16} aria-hidden="true" />
                        </button>
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
        <EntryDialog
          key={editing.id}
          kind={kind}
          action={update}
          title={`Edit ${noun}`}
          submitLabel="Save changes"
          defaults={editing}
          entryId={editing.id}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDeleteDialog
          key={deleting.id}
          title={`Delete ${noun}?`}
          message={`“${deleting.title}” (${formatMoney(deleting.amount, deleting.currency)}) will be permanently removed.`}
          action={remove}
          id={deleting.id}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
