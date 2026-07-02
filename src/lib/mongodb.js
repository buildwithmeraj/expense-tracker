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

export function getDb() {
  return client.db(DB_NAME);
}

export default client;
