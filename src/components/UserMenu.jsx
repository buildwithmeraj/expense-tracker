"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";
import { NAV_LINKS } from "./navLinks";

export default function UserMenu({ user }) {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      // No server-action round trip: post the sign-out and hard-navigate
      // straight to the landing page for a fresh, signed-out render.
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        {user.image ? (
          <div className="w-9 rounded-full">
            <Image src={user.image} alt={user.name ?? "User avatar"} width={36} height={36} />
          </div>
        ) : (
          <div className="avatar-placeholder w-9 rounded-full bg-secondary text-secondary-content">
            <span>{(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}</span>
          </div>
        )}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-40 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-lg"
      >
        <li className="menu-title truncate">{user.name ?? user.email}</li>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
        <li>
          <button type="button" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <IconLogout size={16} aria-hidden="true" />
            )}
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}
