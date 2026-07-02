"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import { CATEGORIES } from "@/lib/categories";
import {
  insertExpense,
  updateExpenseById,
  deleteExpenseById,
} from "@/lib/expenses";

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

function parseExpense(formData) {
  const title = formData.get("title")?.toString().trim();
  const amount = Number(formData.get("amount"));
  const category = formData.get("category")?.toString();
  const date = formData.get("date")?.toString();
  const note = formData.get("note")?.toString().trim() ?? "";

  if (!title || title.length > 100) {
    return { error: "Title is required (max 100 characters)." };
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    return { error: "Amount must be a positive number." };
  }
  if (!CATEGORIES.some((c) => c.value === category)) {
    return { error: "Pick a valid category." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Pick a valid date." };
  }
  if (note.length > 300) {
    return { error: "Note is too long (max 300 characters)." };
  }

  return {
    expense: {
      title,
      amount: Math.round(amount * 100) / 100,
      category,
      date,
      note,
    },
  };
}

export async function addExpense(prevState, formData) {
  const user = await requireUser();
  const { error, expense } = parseExpense(formData);
  if (error) return { error };

  await insertExpense(user.id, expense);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateExpense(prevState, formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  const { error, expense } = parseExpense(formData);
  if (error) return { error };

  const updated = id && (await updateExpenseById(user.id, id, expense));
  if (!updated) return { error: "Expense not found." };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteExpense(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (id) {
    await deleteExpenseById(user.id, id);
    revalidatePath("/dashboard");
  }
}
