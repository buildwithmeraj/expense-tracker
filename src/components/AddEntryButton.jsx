"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { addExpense, addIncome } from "@/app/actions";
import EntryDialog from "./EntryDialog";

const ADD_ACTIONS = { expense: addExpense, income: addIncome };

export default function AddEntryButton({ kind }) {
  const [open, setOpen] = useState(false);
  const noun = kind === "income" ? "income" : "expense";

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        <IconPlus size={18} aria-hidden="true" />
        Add {noun}
      </button>
      {open && (
        <EntryDialog
          kind={kind}
          action={ADD_ACTIONS[kind]}
          title={`Add ${noun}`}
          submitLabel={`Add ${noun}`}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
