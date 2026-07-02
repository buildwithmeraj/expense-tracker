import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 p-6 text-base-content">
      <aside className="gap-2">
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="" width={20} height={20} />
          <span className="font-semibold">
            Expense<span className="text-primary">Tracker</span>
          </span>
        </div>
        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} ExpenseTracker — know where your money goes.
        </p>
      </aside>
    </footer>
  );
}
