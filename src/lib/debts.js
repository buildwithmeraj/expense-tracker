import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

// { userId, person, direction: "iOwe" | "owedToMe", amount, currency,
//   date, dueDate?, note, status: "open" | "settled" }
const collection = () => getDb().collection("debts");

export async function listDebts(userId) {
  // "open" sorts before "settled", so active debts come first.
  const docs = await collection()
    .find({ userId })
    .sort({ status: 1, date: -1, createdAt: -1 })
    .toArray();

  return docs.map((d) => ({
    id: d._id.toString(),
    person: d.person,
    direction: d.direction,
    amount: d.amount,
    currency: d.currency ?? "USD",
    date: d.date,
    dueDate: d.dueDate ?? null,
    note: d.note ?? "",
    status: d.status ?? "open",
  }));
}

export async function insertDebt(userId, debt) {
  await collection().insertOne({
    userId,
    ...debt,
    status: "open",
    createdAt: new Date(),
  });
}

export async function updateDebtById(userId, id, debt) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...debt, updatedAt: new Date() } }
  );
  return matchedCount > 0;
}

export async function setDebtStatus(userId, id, status) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { status, settledAt: status === "settled" ? new Date() : null } }
  );
  return matchedCount > 0;
}

export async function deleteDebtById(userId, id) {
  const { deletedCount } = await collection().deleteOne({
    _id: new ObjectId(id),
    userId,
  });
  return deletedCount > 0;
}
