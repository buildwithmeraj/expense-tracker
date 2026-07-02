"use client";

// Catches errors thrown from the root layout (e.g. the database being
// unreachable while checking the session). Must render its own <html>.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
        <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
          Couldn&apos;t reach the server or database. Make sure MongoDB is running, then try again.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#2197f2",
            color: "#fdfeff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.6rem 1.4rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
