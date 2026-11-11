import { Link } from "@tanstack/react-router";
import { Chip, DishImage } from "@/components/app-ui";
import type { Dish } from "@/types";
export function DishCard({ dish }: { dish: Dish }) { return <Link to="/library/$slug" params={{ slug: dish.slug }} className="group block space-y-3 rounded-md p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><DishImage dish={dish} className="w-full border border-border transition-opacity group-hover:opacity-90"/><div className="space-y-1.5 px-1"><h2 className="font-semibold">{dish.nameVi}</h2><p className="text-sm text-muted-foreground">{dish.nameEn}</p><div className="flex flex-wrap gap-2">{dish.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}</div></div></Link>; }
