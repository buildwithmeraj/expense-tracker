import Image from "next/image";
import Link from "next/link";
import { IconChartBar, IconLock, IconPencilPlus } from "@tabler/icons-react";
import { auth } from "@/auth";
import SignInButton from "@/components/SignInButton";

const features = [
  {
    icon: IconPencilPlus,
    title: "Log in seconds",
    text: "Add an expense with a title, amount, and category — done before you pocket the receipt.",
  },
  {
    icon: IconChartBar,
    title: "See the patterns",
    text: "Monthly totals and category breakdowns show exactly where your money goes.",
  },
  {
    icon: IconLock,
    title: "Private by default",
    text: "Sign in with Google. Your expenses belong to your account and nobody else's.",
  },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <section className="hero flex-1 py-16">
        <div className="hero-content text-center">
          <div className="flex max-w-xl flex-col items-center">
            <Image
              src="/icon.png"
              alt="ExpenseTracker wallet icon"
              width={120}
              height={120}
              priority
              className="mb-6 drop-shadow-lg"
            />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Know where your <span className="text-primary">money</span> goes
            </h1>
            <p className="py-6 text-lg opacity-80">
              A simple, fast expense tracker. Log your spending, watch the monthly
              trends, and keep your budget honest.
            </p>
            {session?.user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Open your dashboard
              </Link>
            ) : (
              <SignInButton className="btn-primary btn-lg" />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon size={24} aria-hidden="true" />
                </div>
                <h2 className="card-title">{feature.title}</h2>
                <p className="text-sm opacity-70">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
