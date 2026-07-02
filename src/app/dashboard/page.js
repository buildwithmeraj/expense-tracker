import Link from "next/link";
import { redirect } from "next/navigation";
import { IconArrowRight, IconWallet } from "@tabler/icons-react";
import { auth } from "@/auth";
import { expenseStore, incomeStore } from "@/lib/entries";
import { listDebts } from "@/lib/debts";
import { listSubscriptions, needsAttention } from "@/lib/subscriptions";
import { addDays, addMonths, monthOf } from "@/lib/dateRange";
import { formatDate, formatMoney, sumByCurrency, today } from "@/lib/format";
import { CURRENCIES } from "@/lib/currencies";
import { getCategory } from "@/lib/categories";
import SummaryCards from "@/components/SummaryCards";
import MoneyAmounts from "@/components/MoneyAmounts";
import TrendChart from "@/components/TrendChart";
import DonutChart from "@/components/DonutChart";
import SubscriptionsDueAlert from "@/components/SubscriptionsDueAlert";

export const metadata = { title: "Dashboard" };

const monthShort = (ym) =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });

function buildTrends(expenses, incomes, currentMonth) {
  const window = Array.from({ length: 6 }, (_, i) => addMonths(currentMonth, i - 5));
  return CURRENCIES.map((currency) => {
    const months = window.map((ym) => {
      const inMonth = (e) => e.currency === currency.code && monthOf(e.date) === ym;
      const sum = (items) =>
        items.filter(inMonth).reduce((total, e) => total + e.amount, 0);
      return { ym, label: monthShort(ym), expense: sum(expenses), income: sum(incomes) };
    });
    return { currency, months };
  }).filter(({ months }) => months.some((m) => m.expense > 0 || m.income > 0));
}

function buildDonuts(monthExpenses) {
  return CURRENCIES.map((currency) => {
    const byCategory = {};
    for (const e of monthExpenses) {
      if (e.currency !== currency.code) continue;
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    }
    const slices = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([value, total]) => ({
        label: getCategory("expense", value).label,
        value: total,
      }));
    return { currency, slices };
  }).filter(({ slices }) => slices.length > 0);
}

function RecentActivity({ items }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <h2 className="card-title text-base">Recent activity</h2>
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const category = getCategory(item.kind, item.category);
            const CategoryIcon = category.icon;
            const isExpense = item.kind === "expense";
            return (
              <li key={`${item.kind}-${item.id}`} className="flex items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    isExpense ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                  }`}
                >
                  <CategoryIcon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="block text-xs opacity-60">
                    {formatDate(item.date)} · {category.label}
                  </span>
                </span>
                <span
                  className={`ml-auto text-sm font-semibold whitespace-nowrap ${
                    isExpense ? "text-error" : "text-success"
                  }`}
                >
                  {isExpense ? "−" : "+"}
                  {formatMoney(item.amount, item.currency)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const now = today();
  const ym = monthOf(now);
  // Everything the dashboard shows lives inside the 6-month trend window.
  const since = `${addMonths(ym, -5)}-01`;

  const [expenses, incomes, debts, subscriptions] = await Promise.all([
    expenseStore.list(session.user.id, { since }),
    incomeStore.list(session.user.id, { since }),
    listDebts(session.user.id),
    listSubscriptions(session.user.id),
  ]);
  const dueSubscriptions = subscriptions.filter((s) =>
    needsAttention(s, now, addDays(now, 7))
  );
  const monthExpenses = expenses.filter((e) => e.date.startsWith(ym));
  const monthIncomes = incomes.filter((e) => e.date.startsWith(ym));

  const trends = buildTrends(expenses, incomes, ym);
  const donuts = buildDonuts(monthExpenses);

  const openDebts = debts.filter((d) => d.status === "open");
  const youOwe = sumByCurrency(openDebts.filter((d) => d.direction === "iOwe"));
  const owedToYou = sumByCurrency(openDebts.filter((d) => d.direction === "owedToMe"));

  const recent = [
    ...expenses.map((e) => ({ ...e, kind: "expense" })),
    ...incomes.map((e) => ({ ...e, kind: "income" })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);

  const hasAnyData = expenses.length + incomes.length + debts.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">
          Hey, {session.user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="opacity-70">All your money, at a glance.</p>
      </div>

      <SubscriptionsDueAlert due={dueSubscriptions} today={now} />

      <SummaryCards expenses={monthExpenses} incomes={monthIncomes} label="This month" />

      {!hasAnyData && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body items-center py-16 text-center">
            <IconWallet size={40} className="opacity-40" aria-hidden="true" />
            <h2 className="card-title">Nothing tracked yet</h2>
            <p className="opacity-70">Start with your first expense or income entry.</p>
            <div className="mt-2 flex gap-2">
              <Link href="/expenses" className="btn btn-primary btn-sm">
                Go to expenses
              </Link>
              <Link href="/income" className="btn btn-soft btn-primary btn-sm">
                Go to income
              </Link>
            </div>
          </div>
        </div>
      )}

      {hasAnyData && (
        // No items-start: cards in the same row stretch to equal height,
        // and chart contents center in the extra space via my-auto.
        <div className="grid gap-6 lg:grid-cols-2">
          {trends.map(({ currency, months }) => (
            <div key={currency.code} className="card bg-base-100 shadow-sm">
              <div className="card-body gap-2">
                <h2 className="card-title text-base">
                  Last 6 months — {currency.label} ({currency.symbol})
                </h2>
                <div className="my-auto">
                  <TrendChart months={months} currency={currency.code} />
                </div>
              </div>
            </div>
          ))}

          {donuts.map(({ currency, slices }) => (
            <div key={currency.code} className="card bg-base-100 shadow-sm">
              <div className="card-body gap-2">
                <h2 className="card-title text-base">
                  This month by category ({currency.symbol})
                </h2>
                <div className="my-auto">
                  <DonutChart slices={slices} currency={currency.code} />
                </div>
              </div>
            </div>
          ))}

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body gap-3">
              <h2 className="card-title text-base">Debts</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="opacity-70">You owe</span>
                  <span className="font-semibold text-error">
                    <MoneyAmounts totals={youOwe} />
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="opacity-70">Owed to you</span>
                  <span className="font-semibold text-success">
                    <MoneyAmounts totals={owedToYou} />
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="opacity-70">Open debts</span>
                  <span className="font-semibold">{openDebts.length}</span>
                </div>
              </div>
              <Link href="/debts" className="btn btn-soft btn-primary btn-sm self-start">
                Manage debts
                <IconArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {recent.length > 0 && <RecentActivity items={recent} />}
        </div>
      )}
    </div>
  );
}
