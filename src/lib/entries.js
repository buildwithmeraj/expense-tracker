import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

// Expenses and incomes share the same shape:
// { userId, title, amount, currency, category, date, note }
function createEntryStore(collectionName) {
  const collection = () => getDb().collection(collectionName);

  return {
    // `since` (YYYY-MM-DD) limits the query window, e.g. for the dashboard.
    async list(userId, { since } = {}) {
      const filter = since ? { userId, date: { $gte: since } } : { userId };
      const docs = await collection()
        .find(filter)
        .sort({ date: -1, createdAt: -1 })
        .toArray();

      // Serialize for client components; entries created before dual
      // currency support default to USD.
      return docs.map(({ _id, userId: _owner, createdAt, updatedAt, ...rest }) => ({
        id: _id.toString(),
        currency: "USD",
        ...rest,
      }));
    },

    async insert(userId, entry) {
      await collection().insertOne({ userId, ...entry, createdAt: new Date() });
    },

    async update(userId, id, entry) {
      const { matchedCount } = await collection().updateOne(
        { _id: new ObjectId(id), userId },
        { $set: { ...entry, updatedAt: new Date() } }
      );
      return matchedCount > 0;
    },

    async remove(userId, id) {
      const { deletedCount } = await collection().deleteOne({
        _id: new ObjectId(id),
        userId,
      });
      return deletedCount > 0;
    },
  };
}

export const expenseStore = createEntryStore("expenses");
export const incomeStore = createEntryStore("incomes");
