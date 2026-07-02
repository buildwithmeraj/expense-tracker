"use client";

import { useActionState, useEffect, useRef } from "react";
import { addExpense } from "@/app/actions";
import ExpenseFields from "./ExpenseFields";

export default function ExpenseForm() {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(addExpense, null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Add expense</h2>
        <form ref={formRef} action={formAction} className="flex flex-col gap-3">
          <ExpenseFields />
          {state?.error && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              {state.error}
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending && <span className="loading loading-spinner loading-sm" />}
            Add expense
          </button>
        </form>
      </div>
    </div>
  );
}
