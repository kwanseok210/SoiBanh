import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Dice5, Search, X } from "lucide-react";
import { APP_NAME } from "@/config";
import { dishes } from "@/data/dishes";
import { Chip, EmptyState, PageHeader, Skeleton } from "@/components/app-ui";
import { DishCard } from "@/components/dish-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterDishes } from "@/lib/dish-search";

type LibrarySearch = { q?: string; taste?: string };
export const Route = createFileRoute("/library/")({
  validateSearch: (search: Record<string, unknown>): LibrarySearch => ({
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
    ...(typeof search["taste"] === "string" ? { taste: search["taste"] } : {}),
  }),
  head: () => ({ meta: [
    { title: `Thư viện món bánh — ${APP_NAME}` },
    { name: "description", content: "10 món bánh Việt Nam mà Soi Bánh nhận diện được." },
    { property: "og:title", content: `Thư viện món bánh — ${APP_NAME}` },
    { property: "og:description", content: "10 món bánh Việt Nam mà Soi Bánh nhận diện được." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { q, taste } = Route.useSearch();
  const navigate = useNavigate({ from: "/library/" });
  const [search, setSearch] = useState(q ?? "");
  const filter: "Tất cả" | "Mặn" | "Ngọt" = taste === "Mặn" || taste === "Ngọt" ? taste : "Tất cả";
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 140);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => setSearch(q ?? ""), [q]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search !== (q ?? "")) {
        void navigate({ search: (previous) => {
          const next = { ...previous };
          if (search) next.q = search;
          else delete next.q;
          return next;
        }, replace: true });
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [navigate, q, search]);

  const visibleDishes = useMemo(() => filterDishes(dishes, search, filter), [search, filter]);
  function setTaste(next: "Tất cả" | "Mặn" | "Ngọt") {
    void navigate({ search: (previous) => {
      const nextSearch = { ...previous };
      if (next === "Tất cả") delete nextSearch.taste;
      else nextSearch.taste = next;
      return nextSearch;
    }, replace: true });
  }
  function pickRandomDish() {
    const selected = dishes[Math.floor(Math.random() * dishes.length)];
    if (selected) void navigate({ to: "/library/$slug", params: { slug: selected.slug }, search: { ...(q ? { q } : {}), ...(filter !== "Tất cả" ? { taste: filter } : {}) } });
  }
  const counts = {
    Mặn: dishes.filter((dish) => dish.tags.includes("Mặn")).length,
    Ngọt: dishes.filter((dish) => dish.tags.includes("Ngọt")).length,
  };

  return <div className="space-y-7">
    <PageHeader title="Thư viện món bánh" subtitle="10 món bánh Việt Nam trong thư viện Soi Bánh" action={<Button type="button" variant="outline" onClick={pickRandomDish}><Dice5 />Chọn ngẫu nhiên cho tôi</Button>} />
    <section className="sticky top-16 z-30 -mx-5 space-y-4 border-y border-border bg-background/95 px-5 py-4 backdrop-blur-md md:-mx-10 md:px-10" aria-label="Tìm và lọc món bánh">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Lọc theo hương vị">
          <Chip selected={filter === "Tất cả"} onClick={() => setTaste("Tất cả")}>Tất cả <span className="ml-1 text-muted-foreground">{dishes.length}</span></Chip>
          <Chip selected={filter === "Mặn"} onClick={() => setTaste("Mặn")}>Mặn <span className="ml-1 text-muted-foreground">{counts.Mặn}</span></Chip>
          <Chip selected={filter === "Ngọt"} onClick={() => setTaste("Ngọt")}>Ngọt <span className="ml-1 text-muted-foreground">{counts.Ngọt}</span></Chip>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label className="sr-only" htmlFor="dish-search">Tìm món bánh</label>
          <Input id="dish-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm món bánh" className="h-11 border-border bg-card pl-10 pr-10" />
          {search && <Button type="button" variant="ghost" size="icon" aria-label="Xóa từ khóa tìm kiếm" className="absolute right-1 top-1 h-9 w-9" onClick={() => setSearch("")}><X /></Button>}
        </div>
      </div>
    </section>
    <p className="sr-only" aria-live="polite">Tìm thấy {visibleDishes.length} món</p>
    {loading ? <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="space-y-3"><Skeleton className="aspect-[4/3]" /><Skeleton className="h-4 w-2/3" /></div>)}</div>
      : visibleDishes.length === 0 ? <EmptyState title={`Không có món nào khớp với “${search}”`} description="Thử gõ không dấu hoặc xóa bộ lọc" action={<Button variant="secondary" onClick={() => { setSearch(""); setTaste("Tất cả"); }}>Xóa bộ lọc</Button>} />
      : <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">{visibleDishes.map((dish) => <DishCard key={dish.slug} dish={dish} />)}</div>}
  </div>;
}