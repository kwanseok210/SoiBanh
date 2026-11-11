// Mock implementation. Replace with HTTP calls to the real API.
import { dishes } from "@/data/dishes";
import type { Dish } from "@/types";

export async function getDishes(): Promise<Dish[]> {
  return dishes;
}

export async function getDish(slug: string): Promise<Dish | null> {
  return dishes.find((dish) => dish.slug === slug) ?? null;
}