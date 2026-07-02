"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import { categoriesFor } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";
import { expenseStore, incomeStore } from "@/lib/entries";
import {
  deleteDebtById,
  insertDebt,
  setDebtStatus,
  updateDebtById,
} from "@/lib/debts";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseAmount(formData) {
  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    return { error: "Amount must be a positive number." };
  }
  const currency = formData.get("currency")?.toString();
  if (!CURRENCIES.some((c) => c.code === currency)) {
    return { error: "Pick a valid currency." };
  }
  return { amount: Math.round(amount * 100) / 100, currency };
}

// ── Expenses & incomes ──────────────────────────────────────────────

function parseEntry(kind, formData) {
  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString();
  const date = formData.get("date")?.toString();
  const note = formData.get("note")?.toString().trim() ?? "";

  if (!title || title.length > 100) {
    return { error: "Title is required (max 100 characters)." };
  }
  const { error, amount, currency } = parseAmount(formData);
  if (error) return { error };
  if (!categoriesFor(kind).some((c) => c.value === category)) {
    return { error: "Pick a valid category." };
  }
  if (!DATE_RE.test(date)) {
    return { error: "Pick a valid date." };
  }
  if (note.length > 300) {
    return { error: "Note is too long (max 300 characters)." };
  }

  return { entry: { title, amount, currency, category, date, note } };
}

const ENTRY_KINDS = {
  expense: { store: expenseStore, paths: ["/dashboard"] },
  income: { store: incomeStore, paths: ["/income", "/dashboard"] },
};

async function saveEntry(kind, formData) {
  const user = await requireUser();
  const { error, entry } = parseEntry(kind, formData);
  if (error) return { error };

  const { store, paths } = ENTRY_KINDS[kind];
  const id = formData.get("id")?.toString();

  if (id) {
    const updated = await store.update(user.id, id, entry);
    if (!updated) return { error: "Entry not found." };
  } else {
    await store.insert(user.id, entry);
  }

  paths.forEach(revalidatePath);
  return { success: true };
}

async function removeEntry(kind, formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (id) {
    await ENTRY_KINDS[kind].store.remove(user.id, id);
    ENTRY_KINDS[kind].paths.forEach(revalidatePath);
  }
}

export async function addExpense(prevState, formData) {
  return saveEntry("expense", formData);
}

export async function updateExpense(prevState, formData) {
  return saveEntry("expense", formData);
}

export async function deleteExpense(formData) {
  await removeEntry("expense", formData);
}

export async function addIncome(prevState, formData) {
  return saveEntry("income", formData);
}

export async function updateIncome(prevState, formData) {
  return saveEntry("income", formData);
}

export async function deleteIncome(formData) {
  await removeEntry("income", formData);
}

// ── Debts ───────────────────────────────────────────────────────────

function parseDebt(formData) {
  const person = formData.get("person")?.toString().trim();
  const direction = formData.get("direction")?.toString();
  const date = formData.get("date")?.toString();
  const dueDate = formData.get("dueDate")?.toString() || null;
  const note = formData.get("note")?.toString().trim() ?? "";

  if (!person || person.length > 60) {
    return { error: "Person is required (max 60 characters)." };
  }
  if (!["iOwe", "owedToMe"].includes(direction)) {
    return { error: "Pick who owes whom." };
  }
  const { error, amount, currency } = parseAmount(formData);
  if (error) return { error };
  if (!DATE_RE.test(date)) {
    return { error: "Pick a valid date." };
  }
  if (dueDate && !DATE_RE.test(dueDate)) {
    return { error: "Pick a valid due date." };
  }
  if (note.length > 300) {
    return { error: "Note is too long (max 300 characters)." };
  }

  return { debt: { person, direction, amount, currency, date, dueDate, note } };
}

export async function addDebt(prevState, formData) {
  const user = await requireUser();
  const { error, debt } = parseDebt(formData);
  if (error) return { error };

  await insertDebt(user.id, debt);
  revalidatePath("/debts");
  return { success: true };
}

export async function updateDebt(prevState, formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  const { error, debt } = parseDebt(formData);
  if (error) return { error };

  const updated = id && (await updateDebtById(user.id, id, debt));
  if (!updated) return { error: "Debt not found." };

  revalidatePath("/debts");
  return { success: true };
}

export async function toggleDebtStatus(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (id && ["open", "settled"].includes(status)) {
    await setDebtStatus(user.id, id, status);
    revalidatePath("/debts");
  }
}

export async function deleteDebt(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (id) {
    await deleteDebtById(user.id, id);
    revalidatePath("/debts");
  }
}
