"use client";

import { IconDatabaseOff } from "@tabler/icons-react";

export default function DbErrorCard({ reset }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="card max-w-md bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <IconDatabaseOff size={40} className="text-error" aria-hidden="true" />
          <h2 className="card-title">Couldn&apos;t load your data</h2>
          <p className="text-sm opacity-70">
            The database didn&apos;t respond. Check that MongoDB is reachable and the
            <code className="mx-1">MONGODB_URI</code> in <code>.env.local</code> is correct.
          </p>
          <button className="btn btn-primary mt-2" onClick={reset}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
