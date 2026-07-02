import {
  IconBook,
  IconBulb,
  IconBus,
  IconHome,
  IconMovie,
  IconPill,
  IconReceipt,
  IconShoppingBag,
  IconToolsKitchen2,
} from "@tabler/icons-react";

export const CATEGORIES = [
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

export function getCategory(value) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES.at(-1);
}
