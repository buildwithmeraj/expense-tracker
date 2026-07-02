import { categoriesFor } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";

export default function SubscriptionFields({ defaults = {} }) {
  return (
    <>
      <label className="form-control w-full">
        <span className="label label-text">Name</span>
        <input
          type="text"
          name="name"
          required
          maxLength={60}
          placeholder="e.g. Netflix"
          defaultValue={defaults.name}
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
          <span className="label label-text">Billing cycle</span>
          <select
            name="cycle"
            required
            defaultValue={defaults.cycle ?? "monthly"}
            className="select select-bordered w-full"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <label className="form-control w-full">
          <span className="label label-text">Category</span>
          <select
            name="category"
            required
            defaultValue={defaults.category ?? "entertainment"}
            className="select select-bordered w-full"
          >
            {categoriesFor("expense").map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-control w-full">
        <span className="label label-text">Next billing date</span>
        <input
          type="date"
          name="nextDue"
          required
          defaultValue={defaults.nextDue ?? new Date().toISOString().slice(0, 10)}
          suppressHydrationWarning
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label label-text">
          Note <span className="opacity-50">(optional)</span>
        </span>
        <textarea
          name="note"
          maxLength={300}
          rows={2}
          placeholder="Plan details, who shares it…"
          defaultValue={defaults.note}
          className="textarea textarea-bordered w-full"
        />
      </label>
    </>
  );
}
