import { auth } from "@/auth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SignInButton from "./SignInButton";
import UserMenu from "./UserMenu";
import NavTabs from "./NavTabs";
import MobileSidebar from "./MobileSidebar";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 bg-base-100/90 shadow-sm backdrop-blur">
      <div className="navbar mx-auto max-w-5xl px-4">
        <div className="navbar-start gap-1">
          {session?.user && <MobileSidebar />}
          <Logo />
        </div>
        <div className="navbar-center">{session?.user && <NavTabs />}</div>
        <div className="navbar-end gap-1">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <SignInButton className="btn-soft btn-primary btn-sm" />
          )}
        </div>
      </div>
    </header>
  );
}
