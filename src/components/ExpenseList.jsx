"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { IconPencil, IconReceipt, IconTrash } from "@tabler/icons-react";
import { deleteExpense, updateExpense } from "@/app/actions";
import { getCategory } from "@/lib/categories";
import { formatDate, formatMoney } from "@/lib/format";
import ExpenseFields from "./ExpenseFields";

function EditExpenseDialog({ expense, onClose }) {
  const dialogRef = useRef(null);
  const [state, formAction, pending] = useActionState(updateExpense, null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="mb-2 text-lg font-bold">Edit expense</h3>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={expense.id} />
          <ExpenseFields defaults={expense} />
          {state?.error && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              {state.error}
            </div>
          )}
          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending && <span className="loading loading-spinner loading-sm" />}
              Save changes
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default function ExpenseList({ expenses }) {
  const [editing, setEditing] = useState(null);

  if (expenses.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center py-16 text-center">
          <IconReceipt size={40} className="opacity-40" aria-hidden="true" />
          <h2 className="card-title">No expenses yet</h2>
          <p className="opacity-70">Add your first expense to start tracking.</p>
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
                <th>Expense</th>
                <th className="hidden sm:table-cell">Category</th>
                <th className="hidden sm:table-cell">Date</th>
                <th className="text-right">Amount</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const category = getCategory(expense.category);
                const CategoryIcon = category.icon;
                return (
                  <tr key={expense.id} className="hover">
                    <td>
                      <div className="font-medium">{expense.title}</div>
                      <div className="flex items-center gap-1 text-xs opacity-60 sm:hidden">
                        <CategoryIcon size={12} aria-hidden="true" />
                        {formatDate(expense.date)}
                      </div>
                      {expense.note && (
                        <div className="max-w-52 truncate text-xs opacity-60">{expense.note}</div>
                      )}
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="badge badge-secondary badge-outline gap-1 whitespace-nowrap">
                        <CategoryIcon size={12} aria-hidden="true" />
                        {category.label}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap sm:table-cell">
                      {formatDate(expense.date)}
                    </td>
                    <td className="text-right font-semibold whitespace-nowrap">
                      {formatMoney(expense.amount)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-xs"
                          aria-label={`Edit ${expense.title}`}
                          onClick={() => setEditing(expense)}
                        >
                          <IconPencil size={16} aria-hidden="true" />
                        </button>
                        <form
                          action={deleteExpense}
                          onSubmit={(e) => {
                            if (!confirm(`Delete "${expense.title}"?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={expense.id} />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-square btn-xs text-error"
                            aria-label={`Delete ${expense.title}`}
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
        <EditExpenseDialog
          key={editing.id}
          expense={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
