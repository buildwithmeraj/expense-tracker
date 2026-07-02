import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

function collection() {
  return getDb().collection("expenses");
}

export async function getExpenses(userId) {
  const docs = await collection()
    .find({ userId })
    .sort({ date: -1, createdAt: -1 })
    .toArray();

  // Serialize for client components: ObjectId -> string.
  return docs.map(({ _id, userId: _owner, createdAt, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));
}

export async function insertExpense(userId, expense) {
  await collection().insertOne({
    userId,
    ...expense,
    createdAt: new Date(),
  });
}

export async function updateExpenseById(userId, id, expense) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...expense, updatedAt: new Date() } }
  );
  return matchedCount > 0;
}

export async function deleteExpenseById(userId, id) {
  const { deletedCount } = await collection().deleteOne({
    _id: new ObjectId(id),
    userId,
  });
  return deletedCount > 0;
}
