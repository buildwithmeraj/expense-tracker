import {
  IconCoins,
  IconLayoutDashboard,
  IconReceipt,
  IconRepeat,
  IconScale,
} from "@tabler/icons-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: IconReceipt },
  { href: "/subscriptions", label: "Subscriptions", icon: IconRepeat },
  { href: "/income", label: "Income", icon: IconCoins },
  { href: "/debts", label: "Debts", icon: IconScale },
];
