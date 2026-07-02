import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = 28 }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/icon.png" alt="Expense Tracker logo" width={size} height={size} priority />
      <span className="text-lg font-bold tracking-tight">
        Expense<span className="text-primary">Tracker</span>
      </span>
    </Link>
  );
}
