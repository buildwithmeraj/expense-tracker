import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

export default function UserMenu({ user }) {
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
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <form action={signOutAction}>
            <button type="submit" className="w-full text-left">
              Sign out
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}
