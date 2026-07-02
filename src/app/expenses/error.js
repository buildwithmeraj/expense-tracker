"use client";

import DbErrorCard from "@/components/DbErrorCard";

export default function ExpensesError({ reset }) {
  return <DbErrorCard reset={reset} />;
}
