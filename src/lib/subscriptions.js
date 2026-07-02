import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

// { userId, name, amount, currency, cycle: "monthly" | "yearly",
//   category (expense category), nextDue: YYYY-MM-DD, note }
const collection = () => getDb().collection("subscriptions");

export async function listSubscriptions(userId) {
  const docs = await collection()
    .find({ userId })
    .sort({ nextDue: 1, createdAt: -1 })
    .toArray();

  return docs.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    amount: s.amount,
    currency: s.currency ?? "USD",
    cycle: s.cycle,
    category: s.category,
    nextDue: s.nextDue,
    snoozedUntil: s.snoozedUntil ?? null,
    note: s.note ?? "",
  }));
}

// Due within the alert horizon and not currently snoozed.
export function needsAttention(subscription, today, horizonEnd) {
  return (
    subscription.nextDue <= horizonEnd &&
    (!subscription.snoozedUntil || subscription.snoozedUntil <= today)
  );
}

export async function snoozeSubscriptionById(userId, id, snoozedUntil) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { snoozedUntil } }
  );
  return matchedCount > 0;
}

export async function insertSubscription(userId, subscription) {
  await collection().insertOne({
    userId,
    ...subscription,
    createdAt: new Date(),
  });
}

export async function updateSubscriptionById(userId, id, subscription) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...subscription, updatedAt: new Date() } }
  );
  return matchedCount > 0;
}

export async function getSubscriptionById(userId, id) {
  return collection().findOne({ _id: new ObjectId(id), userId });
}

// Advances nextDue only if it still matches `expectedDue` — a double-clicked
// "mark paid" can't advance twice or log two expenses.
export async function advanceSubscription(userId, id, expectedDue, nextDue) {
  const { matchedCount } = await collection().updateOne(
    { _id: new ObjectId(id), userId, nextDue: expectedDue },
    { $set: { nextDue, lastPaidAt: new Date() }, $unset: { snoozedUntil: "" } }
  );
  return matchedCount > 0;
}

export async function deleteSubscriptionById(userId, id) {
  const { deletedCount } = await collection().deleteOne({
    _id: new ObjectId(id),
    userId,
  });
  return deletedCount > 0;
}
