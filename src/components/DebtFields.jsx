import { CURRENCIES } from "@/lib/currencies";

export const DEBT_DIRECTIONS = [
  { value: "iOwe", label: "I owe them" },
  { value: "owedToMe", label: "They owe me" },
];

export default function DebtFields({ defaults = {} }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label label-text">Person</span>
          <input
            type="text"
            name="person"
            required
            maxLength={60}
            placeholder="e.g. Rahim"
            defaultValue={defaults.person}
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <span className="label label-text">Who owes?</span>
          <select
            name="direction"
            required
            defaultValue={defaults.direction ?? "iOwe"}
            className="select select-bordered w-full"
          >
            {DEBT_DIRECTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

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
            Due date <span className="opacity-50">(optional)</span>
          </span>
          <input
            type="date"
            name="dueDate"
            defaultValue={defaults.dueDate ?? ""}
            className="input input-bordered w-full"
          />
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
          placeholder="What was it for?"
          defaultValue={defaults.note}
          className="textarea textarea-bordered w-full"
        />
      </label>
    </>
  );
}
