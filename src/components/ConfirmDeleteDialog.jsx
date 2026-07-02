"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { IconTrash } from "@tabler/icons-react";

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-error" disabled={pending}>
      {pending ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <IconTrash size={16} aria-hidden="true" />
      )}
      Delete
    </button>
  );
}

// daisyUI modal asking to confirm a delete. `action` is the delete Server
// Action; it receives the hidden id field and the dialog closes after it runs.
export default function ConfirmDeleteDialog({ title, message, action, id, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-3 text-sm opacity-80">{message}</p>
        <div className="modal-action mt-1">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <form
            action={async (formData) => {
              await action(formData);
              onClose();
            }}
          >
            <input type="hidden" name="id" value={id} />
            <DeleteSubmit />
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
