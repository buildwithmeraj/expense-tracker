"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  IconArrowBackUp,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCheck,
  IconPencil,
  IconScale,
  IconTrash,
} from "@tabler/icons-react";
import { deleteDebt, toggleDebtStatus, updateDebt } from "@/app/actions";
import { formatDate, formatMoney } from "@/lib/format";
import DebtFields from "./DebtFields";

function EditDebtDialog({ debt, onClose }) {
  const dialogRef = useRef(null);
  const [state, formAction, pending] = useActionState(updateDebt, null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="mb-2 text-lg font-bold">Edit debt</h3>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={debt.id} />
          <DebtFields defaults={debt} />
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

function DirectionBadge({ direction }) {
  return direction === "iOwe" ? (
    <span className="badge badge-error badge-outline gap-1 whitespace-nowrap">
      <IconArrowUpRight size={12} aria-hidden="true" />
      I owe
    </span>
  ) : (
    <span className="badge badge-success badge-outline gap-1 whitespace-nowrap">
      <IconArrowDownLeft size={12} aria-hidden="true" />
      Owed to me
    </span>
  );
}

export default function DebtList({ debts, today }) {
  const [editing, setEditing] = useState(null);

  if (debts.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center py-16 text-center">
          <IconScale size={40} className="opacity-40" aria-hidden="true" />
          <h2 className="card-title">No debts tracked</h2>
          <p className="opacity-70">Add money you owe or money owed to you.</p>
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
                <th>Person</th>
                <th className="hidden sm:table-cell">Direction</th>
                <th className="hidden md:table-cell">Due</th>
                <th className="text-right">Amount</th>
                <th className="w-28" />
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => {
                const settled = debt.status === "settled";
                const overdue = !settled && debt.dueDate && debt.dueDate < today;
                return (
                  <tr key={debt.id} className={`hover ${settled ? "opacity-55" : ""}`}>
                    <td>
                      <div className="flex items-center gap-2 font-medium">
                        {debt.person}
                        {settled && <span className="badge badge-ghost badge-sm">Settled</span>}
                        {overdue && <span className="badge badge-warning badge-sm">Overdue</span>}
                      </div>
                      <div className="text-xs opacity-60 sm:hidden">
                        <DirectionBadge direction={debt.direction} />
                      </div>
                      {debt.note && (
                        <div className="max-w-52 truncate text-xs opacity-60">{debt.note}</div>
                      )}
                    </td>
                    <td className="hidden sm:table-cell">
                      <DirectionBadge direction={debt.direction} />
                    </td>
                    <td className="hidden whitespace-nowrap md:table-cell">
                      {debt.dueDate ? formatDate(debt.dueDate) : "—"}
                    </td>
                    <td
                      className={`text-right font-semibold whitespace-nowrap ${
                        settled ? "" : debt.direction === "iOwe" ? "text-error" : "text-success"
                      }`}
                    >
                      {formatMoney(debt.amount, debt.currency)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <form action={toggleDebtStatus}>
                          <input type="hidden" name="id" value={debt.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={settled ? "open" : "settled"}
                          />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-square btn-xs"
                            aria-label={settled ? `Reopen debt with ${debt.person}` : `Mark debt with ${debt.person} settled`}
                            title={settled ? "Reopen" : "Mark settled"}
                          >
                            {settled ? (
                              <IconArrowBackUp size={16} aria-hidden="true" />
                            ) : (
                              <IconCheck size={16} aria-hidden="true" />
                            )}
                          </button>
                        </form>
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-xs"
                          aria-label={`Edit debt with ${debt.person}`}
                          onClick={() => setEditing(debt)}
                        >
                          <IconPencil size={16} aria-hidden="true" />
                        </button>
                        <form
                          action={deleteDebt}
                          onSubmit={(e) => {
                            if (!confirm(`Delete debt with "${debt.person}"?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={debt.id} />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-square btn-xs text-error"
                            aria-label={`Delete debt with ${debt.person}`}
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
        <EditDebtDialog key={editing.id} debt={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
