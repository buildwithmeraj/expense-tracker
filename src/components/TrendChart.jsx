import { fmtMonthLabel } from "@/lib/dateRange";
import { formatMoney } from "@/lib/format";

const W = 340;
const H = 170;
const PAD = { top: 14, right: 6, bottom: 22, left: 6 };

// Grouped bar chart: spending vs income per month, one currency per chart.
export default function TrendChart({ months, currency }) {
  const chartH = H - PAD.top - PAD.bottom;
  const groupW = (W - PAD.left - PAD.right) / months.length;
  const barW = Math.min(18, groupW / 2.6);
  const max = Math.max(...months.flatMap((m) => [m.expense, m.income]), 1);
  const barTop = (v) => PAD.top + chartH * (1 - v / max);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly spending and income">
        {months.map((m, i) => {
          const center = PAD.left + groupW * i + groupW / 2;
          return (
            <g key={m.ym}>
              <rect
                x={center - barW - 1}
                y={barTop(m.expense)}
                width={barW}
                height={PAD.top + chartH - barTop(m.expense)}
                rx="2"
                fill="var(--color-primary)"
              >
                <title>{`${fmtMonthLabel(m.ym)} spent: ${formatMoney(m.expense, currency)}`}</title>
              </rect>
              <rect
                x={center + 1}
                y={barTop(m.income)}
                width={barW}
                height={PAD.top + chartH - barTop(m.income)}
                rx="2"
                fill="var(--color-success)"
              >
                <title>{`${fmtMonthLabel(m.ym)} income: ${formatMoney(m.income, currency)}`}</title>
              </rect>
              <text
                x={center}
                y={H - 8}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                opacity="0.6"
              >
                {m.label}
              </text>
            </g>
          );
        })}
        <line
          x1={PAD.left}
          y1={PAD.top + chartH + 0.5}
          x2={W - PAD.right}
          y2={PAD.top + chartH + 0.5}
          stroke="currentColor"
          opacity="0.15"
        />
      </svg>
      <div className="mt-1 flex justify-center gap-4 text-xs opacity-70">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" /> Spending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success" /> Income
        </span>
      </div>
    </div>
  );
}
