import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"');
}

export const DB_NAME = "expense-tracker";

const uri = process.env.MONGODB_URI;

let client;

if (process.env.NODE_ENV === "development") {
  // Reuse the client across HMR module reloads in development.
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

let indexesEnsured;

export function getDb() {
  const db = client.db(DB_NAME);
  // Fire-and-forget, once per process: keeps per-user queries indexed as
  // data grows. Failures are non-fatal — indexes are a perf concern only.
  indexesEnsured ??= Promise.allSettled([
    db.collection("expenses").createIndex({ userId: 1, date: -1 }),
    db.collection("incomes").createIndex({ userId: 1, date: -1 }),
    db.collection("debts").createIndex({ userId: 1, status: 1, date: -1 }),
  ]);
  return db;
}

export default client;
