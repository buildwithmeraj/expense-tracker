import { categoriesFor } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";

// Shared inputs for expense and income forms. `defaults` pre-fills for editing.
export default function EntryFields({ kind, defaults = {} }) {
  return (
    <>
      <label className="form-control w-full">
        <span className="label label-text">Title</span>
        <input
          type="text"
          name="title"
          required
          maxLength={100}
          placeholder={kind === "income" ? "e.g. July salary" : "e.g. Groceries"}
          defaultValue={defaults.title}
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <label className="form-control w-full">
          <span className="label label-text">Amount</span>
          <input
            type="number"
            name="amount"
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            defaultValue={defaults.amount}
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <span className="label label-text">Currency</span>
          <select
            name="currency"
            required
            defaultValue={defaults.currency ?? "USD"}
            className="select select-bordered w-full"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label label-text">Date</span>
          <input
            type="date"
            name="date"
            required
            defaultValue={defaults.date ?? new Date().toISOString().slice(0, 10)}
            suppressHydrationWarning
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <span className="label label-text">
            {kind === "income" ? "Source" : "Category"}
          </span>
          <select
            name="category"
            required
            defaultValue={defaults.category ?? categoriesFor(kind)[0].value}
            className="select select-bordered w-full"
          >
            {categoriesFor(kind).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-control w-full">
        <span className="label label-text">
          Note <span className="opacity-50">(optional)</span>
        </span>
        <textarea
          name="note"
          maxLength={300}
          rows={2}
          placeholder="Anything to remember?"
          defaultValue={defaults.note}
          className="textarea textarea-bordered w-full"
        />
      </label>
    </>
  );
}
