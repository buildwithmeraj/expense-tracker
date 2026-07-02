"use client";

import { useActionState, useEffect, useRef } from "react";
import { addExpense, addIncome } from "@/app/actions";
import EntryFields from "./EntryFields";

const ADD_ACTIONS = { expense: addExpense, income: addIncome };

export default function EntryForm({ kind }) {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(ADD_ACTIONS[kind], null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  const noun = kind === "income" ? "income" : "expense";

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Add {noun}</h2>
        <form ref={formRef} action={formAction} className="flex flex-col gap-3">
          <EntryFields kind={kind} />
          {state?.error && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              {state.error}
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending && <span className="loading loading-spinner loading-sm" />}
            Add {noun}
          </button>
        </form>
      </div>
    </div>
  );
}
