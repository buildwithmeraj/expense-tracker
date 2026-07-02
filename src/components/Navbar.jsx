import { auth } from "@/auth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SignInButton from "./SignInButton";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 bg-base-100/90 shadow-sm backdrop-blur">
      <div className="navbar mx-auto max-w-5xl px-4">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <SignInButton className="btn-primary btn-sm" />
          )}
        </div>
      </div>
    </header>
  );
}
