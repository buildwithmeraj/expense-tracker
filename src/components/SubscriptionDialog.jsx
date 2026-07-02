"use client";

import { useActionState, useEffect, useRef } from "react";
import SubscriptionFields from "./SubscriptionFields";

export default function SubscriptionDialog({
  action,
  title,
  submitLabel,
  defaults,
  subscriptionId,
  onClose,
}) {
  const dialogRef = useRef(null);
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <form action={formAction} className="flex flex-col gap-3">
          {subscriptionId && <input type="hidden" name="id" value={subscriptionId} />}
          <SubscriptionFields defaults={defaults} />
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
              {submitLabel}
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
