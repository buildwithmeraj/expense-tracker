"use client";

import { useActionState, useEffect, useRef } from "react";
import { addDebt } from "@/app/actions";
import DebtFields from "./DebtFields";

export default function DebtForm() {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(addDebt, null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Add debt</h2>
        <form ref={formRef} action={formAction} className="flex flex-col gap-3">
          <DebtFields />
          {state?.error && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              {state.error}
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending && <span className="loading loading-spinner loading-sm" />}
            Add debt
          </button>
        </form>
      </div>
    </div>
  );
}
