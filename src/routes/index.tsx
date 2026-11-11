import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { APP_NAME } from "@/config";
import { dishes } from "@/data/dishes";
import { Button } from "@/components/ui/button";
import { DishImage } from "@/components/app-ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${APP_NAME} — Khám phá bánh Việt` },
      { name: "description", content: "Khám phá những món bánh Việt trong thư viện Soi Bánh." },
      { property: "og:title", content: `${APP_NAME} — Khám phá bánh Việt` },
      { property: "og:description", content: "Khám phá những món bánh Việt trong thư viện Soi Bánh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = dishes.slice(0, 4);
  const leadDish = dishes[0];
  if (!leadDish) return null;
  return <div className="space-y-16 pb-8">
    <section className="relative isolate min-h-[480px] overflow-hidden border border-border bg-card">
      <DishImage dish={leadDish} className="absolute inset-0 size-full aspect-auto rounded-none object-cover" />
      <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
      <div className="relative flex min-h-[480px] max-w-3xl flex-col justify-center gap-6 px-6 py-12 text-background sm:px-10 lg:px-16">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">Chụp một chiếc bánh, biết ngay đó là món gì</h1>
        <p className="max-w-lg text-base leading-relaxed">Soi Bánh nhận diện 10 món bánh Việt Nam và chỉ ra từng nguyên liệu ngay trên ảnh.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="h-12 px-5"><Link to="/library">Khám phá thư viện</Link></Button>
          <Button variant="secondary" asChild className="h-12 px-5"><Link to="/analyze"><ScanLine />Phân tích ảnh</Link></Button>
        </div>
      </div>
    </section>
    <section className="space-y-6" aria-labelledby="featured-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="featured-heading" className="text-2xl font-extrabold">Món bánh thân quen</h2></div>
        <Button variant="ghost" asChild className="w-fit"><Link to="/library">Xem tất cả</Link></Button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">{featured.map((dish) => <Link key={dish.slug} to="/library/$slug" params={{ slug: dish.slug }} className="group space-y-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"><DishImage dish={dish} className="w-full border border-border transition-opacity group-hover:opacity-90"/><div><h3 className="font-semibold">{dish.nameVi}</h3><p className="text-sm text-muted-foreground">{dish.nameEn}</p></div></Link>)}</div>
    </section>
  </div>;
}