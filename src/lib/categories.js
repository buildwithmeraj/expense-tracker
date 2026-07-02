import {
  IconBook,
  IconBriefcase,
  IconBuildingStore,
  IconBulb,
  IconBus,
  IconCoin,
  IconDeviceLaptop,
  IconGift,
  IconHome,
  IconMovie,
  IconPill,
  IconReceipt,
  IconShoppingBag,
  IconToolsKitchen2,
  IconTrendingUp,
} from "@tabler/icons-react";

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food & Dining", icon: IconToolsKitchen2 },
  { value: "transport", label: "Transport", icon: IconBus },
  { value: "housing", label: "Housing & Rent", icon: IconHome },
  { value: "utilities", label: "Utilities & Bills", icon: IconBulb },
  { value: "shopping", label: "Shopping", icon: IconShoppingBag },
  { value: "health", label: "Health", icon: IconPill },
  { value: "entertainment", label: "Entertainment", icon: IconMovie },
  { value: "education", label: "Education", icon: IconBook },
  { value: "other", label: "Other", icon: IconReceipt },
];

export const INCOME_CATEGORIES = [
  { value: "salary", label: "Salary", icon: IconBriefcase },
  { value: "business", label: "Business", icon: IconBuildingStore },
  { value: "freelance", label: "Freelance", icon: IconDeviceLaptop },
  { value: "investment", label: "Investment", icon: IconTrendingUp },
  { value: "gift", label: "Gift", icon: IconGift },
  { value: "other", label: "Other", icon: IconCoin },
];

export function categoriesFor(kind) {
  return kind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategory(kind, value) {
  const list = categoriesFor(kind);
  return list.find((c) => c.value === value) ?? list.at(-1);
}
