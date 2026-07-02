"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { addSubscription } from "@/app/actions";
import SubscriptionDialog from "./SubscriptionDialog";

export default function AddSubscriptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        <IconPlus size={18} aria-hidden="true" />
        Add subscription
      </button>
      {open && (
        <SubscriptionDialog
          action={addSubscription}
          title="Add subscription"
          submitLabel="Add subscription"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
