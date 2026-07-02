"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./navLinks";

export default function NavTabs() {
  const pathname = usePathname();
  return (
    <ul className="menu menu-horizontal hidden gap-1 px-0 md:flex">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => (
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
