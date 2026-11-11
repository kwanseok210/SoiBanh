import type { Dish } from "@/types";

export function normalizeDishText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "d")
    .toLocaleLowerCase("vi")
    .trim();
}

export function filterDishes(dishes: Dish[], query: string, filter: "Tất cả" | "Mặn" | "Ngọt"): Dish[] {
  const normalizedQuery = normalizeDishText(query);
  return dishes.filter((dish) => {
    const matchesFilter = filter === "Tất cả" || dish.tags.includes(filter);
    const matchesQuery = !normalizedQuery || normalizeDishText(`${dish.nameVi} ${dish.nameEn} ${dish.summary}`).includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });
}

export function scaleIngredientAmount(amount: string, baseServings: number, servings: number): string {
  const match = amount.match(/^(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?)(.*)$/);
  if (!match?.[1] || baseServings <= 0) return amount;
  const [whole, fraction] = match[1].split("/");
  if (!whole) return amount;
  const parsedWhole = Number(whole.replace(",", "."));
  const parsedFraction = fraction === undefined ? 0 : Number(fraction.replace(",", "."));
  if (!Number.isFinite(parsedWhole) || (fraction !== undefined && (!Number.isFinite(parsedFraction) || parsedFraction === 0))) return amount;
  const original = fraction === undefined ? parsedWhole : parsedWhole / parsedFraction;
  const scaled = original * servings / baseServings;
  const formatted = Number(scaled.toFixed(2)).toString();
  return `${formatted}${match[2]}`;
}