"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { NAV_LINKS } from "./navLinks";

// Slide-in navigation drawer for small screens.
export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-circle md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <IconMenu2 size={20} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-base-100 p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image src="/icon.png" alt="" width={24} height={24} />
                <span className="font-bold">
                  Expense<span className="text-primary">Tracker</span>
                </span>
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <IconX size={18} aria-hidden="true" />
              </button>
            </div>
            <ul className="menu w-full gap-1 p-0">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={pathname === href ? "menu-active" : ""}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
