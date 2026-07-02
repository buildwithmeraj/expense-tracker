"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCoins, IconMenu2, IconReceipt, IconScale } from "@tabler/icons-react";

const LINKS = [
  { href: "/dashboard", label: "Expenses", icon: IconReceipt },
  { href: "/income", label: "Income", icon: IconCoins },
  { href: "/debts", label: "Debts", icon: IconScale },
];

export function NavTabsDesktop() {
  const pathname = usePathname();
  return (
    <ul className="menu menu-horizontal hidden gap-1 px-0 md:flex">
      {LINKS.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link href={href} className={pathname === href ? "menu-active" : ""}>
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function NavTabsMobile() {
  const pathname = usePathname();
  return (
    <div className="dropdown md:hidden">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open navigation">
        <IconMenu2 size={20} aria-hidden="true" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-40 mt-3 w-48 rounded-box bg-base-100 p-2 shadow-lg"
      >
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? "menu-active" : ""}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
