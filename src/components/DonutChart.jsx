import { formatMoney } from "@/lib/format";

const PALETTE = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-error)",
  "var(--color-neutral)",
  "color-mix(in oklab, var(--color-primary) 50%, var(--color-warning))",
];

const R = 40;
const CIRC = 2 * Math.PI * R;

// Donut of amounts by category for a single currency.
// `slices`: [{ label, value }] sorted descending.
export default function DonutChart({ slices, currency }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const fractions = slices.map((s) => s.value / total);
  const startOf = (i) => fractions.slice(0, i).reduce((a, b) => a + b, 0);
  const rendered = slices.map((slice, i) => (
    <circle
      key={slice.label}
      cx="50"
      cy="50"
      r={R}
      fill="none"
      stroke={PALETTE[i % PALETTE.length]}
      strokeWidth="16"
      strokeDasharray={`${fractions[i] * CIRC} ${CIRC}`}
      strokeDashoffset={-startOf(i) * CIRC}
      transform="rotate(-90 50 50)"
    >
      <title>{`${slice.label}: ${formatMoney(slice.value, currency)} (${Math.round(fractions[i] * 100)}%)`}</title>
    </circle>
  ));

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="size-32 shrink-0" role="img" aria-label="Breakdown by category">
        {rendered}
        <text
          x="50"
          y="53"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          {formatMoney(total, currency)}
        </text>
      </svg>
      <ul className="flex flex-col gap-1 text-xs">
        {slices.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="opacity-80">{slice.label}</span>
            <span className="ml-auto pl-2 font-medium">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
