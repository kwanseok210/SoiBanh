import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChefHat, Clock3, MapPin, Minus, Plus, Sparkles, Utensils, X } from "lucide-react";
import { toast } from "sonner";
import { APP_NAME } from "@/config";
import { getDish } from "@/api/dishes";
import { prepProgress } from "@/api/prepProgress";
import { sampleResults } from "@/data/sampleResults";
import { dishes } from "@/data/dishes";
import { DishCard } from "@/components/dish-card";
import { Chip, DishImage } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { scaleIngredientAmount } from "@/lib/dish-search";
import type { Dish } from "@/types";

type DetailSearch = { q?: string; taste?: string; tab?: string };
const tabs = [
  { id: "travel", label: "Du lịch", icon: MapPin },
  { id: "facts", label: "Thú vị", icon: Sparkles },
  { id: "cook", label: "Nấu ăn", icon: ChefHat },
] as const;
type TabId = (typeof tabs)[number]["id"];

export const Route = createFileRoute("/library/$slug")({
  validateSearch: (search: Record<string, unknown>): DetailSearch => ({
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
    ...(typeof search["taste"] === "string" ? { taste: search["taste"] } : {}),
    ...(typeof search["tab"] === "string" ? { tab: search["tab"] } : {}),
  }),
  loader: ({ params }) => getDish(params.slug),
  head: ({ params }) => {
    const dish = dishes.find((item) => item.slug === params.slug);
    const title = dish ? `${dish.nameVi} — ${APP_NAME}` : `Không tìm thấy món bánh — ${APP_NAME}`;
    const description = dish?.summary ?? "Tìm hiểu thêm về các món bánh Việt Nam trong thư viện Soi Bánh.";
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: DishDetailPage,
});

function DishDetailPage() {
  const dish = Route.useLoaderData();
  const { q, taste, tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/library/$slug" });
  const [servings, setServings] = useState(dish?.servings ?? 1);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [cooking, setCooking] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>(isTabId(tab) ? tab : "travel");

  useEffect(() => {
    if (dish) {
      setCheckedIngredients(prepProgress.get(dish.slug));
      setServings(dish.servings);
    }
  }, [dish]);

  useEffect(() => {
    const nextTab = isTabId(tab) ? tab : "travel";
    setActiveTab(nextTab);
    if (!isTabId(tab)) void navigate({ search: (previous) => {
      const next = { ...previous };
      delete next.tab;
      return next;
    }, replace: true });
  }, [navigate, tab]);

  const setTab = useCallback((nextTab: TabId) => {
    setActiveTab(nextTab);
    void navigate({ search: (previous) => {
      const next = { ...previous };
      if (nextTab === "travel") delete next.tab;
      else next.tab = nextTab;
      return next;
    }, replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!cooking) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCooking(false);
      if (event.key === "ArrowRight") setCookingStep((step) => Math.min(step + 1, (dish?.steps.length ?? 1) - 1));
      if (event.key === "ArrowLeft") setCookingStep((step) => Math.max(0, step - 1));
    }
    window.addEventListener("keydown", onKeyDown);
    const wakeLockNavigator = navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> } };
    let lock: { release: () => Promise<void> } | undefined;
    void wakeLockNavigator.wakeLock?.request("screen").then((nextLock) => { lock = nextLock; }).catch(() => undefined);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      void lock?.release().catch(() => undefined);
    };
  }, [cooking, dish?.steps.length]);

  const sample = useMemo(() => dish ? sampleResults.find((item) => item.dishSlug === dish.slug) : undefined, [dish]);
  const related = useMemo(() => dish ? dishes.filter((item) => item.slug !== dish.slug && item.tags.some((tag) => dish.tags.includes(tag))).slice(0, 3) : [], [dish]);

  function setIngredient(index: number, checked: boolean) {
    if (!dish) return;
    const key = String(index);
    setCheckedIngredients((previous) => {
      const next = checked ? [...new Set([...previous, key])] : previous.filter((item) => item !== key);
      prepProgress.set(dish.slug, next);
      return next;
    });
  }

  if (!dish) {
    return <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-extrabold">Không tìm thấy món này</h1>
      <p className="text-muted-foreground">Món bánh có thể đã được chuyển khỏi thư viện.</p>
      <Button asChild><Link to="/library">Về thư viện</Link></Button>
    </section>;
  }

  return <div className="space-y-9">
    <Link to="/library" search={{ ...(q ? { q } : {}), ...(taste ? { taste } : {}) }} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><ArrowLeft className="size-4" />Thư viện</Link>
    <header className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] md:items-center md:gap-10">
      <DishImage dish={dish} className="aspect-[4/3] w-full rounded-[28px] border border-border object-cover md:aspect-[21/9]" />
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">{dish.nameVi}</h1>
        <p className="text-base text-muted-foreground">{dish.nameEn}</p>
        <div className="flex flex-wrap gap-2">{dish.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}</div>
        <p className="max-w-[68ch] text-base leading-relaxed text-muted-foreground">{dish.summary}</p>
        {sample && <Button asChild><Link to="/analyze" search={{ sample: sample.id }}>Thử nhận diện món này<ArrowRight /></Link></Button>}
      </div>
    </header>

    <div className="sticky top-16 z-30 -mx-5 border-y border-border bg-background/95 px-5 py-2 backdrop-blur-md md:-mx-10 md:px-10">
      <div role="tablist" aria-label="Thông tin về món bánh" className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        {tabs.map(({ id, label, icon: Icon }, index) => <button key={id} id={`dish-tab-${id}`} type="button" role="tab" aria-selected={activeTab === id} aria-controls={`dish-panel-${id}`} tabIndex={activeTab === id ? 0 : -1} onClick={() => setTab(id)} onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
          const nextTab = tabs[next];
          if (nextTab) {
            setTab(nextTab.id);
            document.getElementById(`dish-tab-${nextTab.id}`)?.focus();
          }
        }} className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring ${activeTab === id ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}><Icon className="hidden size-4 sm:block" />{label}</button>)}
      </div>
    </div>

    <div id={`dish-panel-${activeTab}`} role="tabpanel" aria-labelledby={`dish-tab-${activeTab}`} tabIndex={0} className="min-h-64 focus-visible:outline-none">
      {activeTab === "travel" && <TravelPanel dish={dish} />}
      {activeTab === "facts" && <FactsPanel dish={dish} />}
      {activeTab === "cook" && <CookPanel dish={dish} servings={servings} setServings={setServings} checkedIngredients={checkedIngredients} setIngredient={setIngredient} clearIngredients={() => { setCheckedIngredients([]); prepProgress.clear(dish.slug); }} doneSteps={doneSteps} toggleStep={(index) => setDoneSteps((previous) => previous.includes(index) ? previous.filter((step) => step !== index) : [...previous, index])} startCooking={() => { setCookingStep(0); setCooking(true); }} />}
    </div>

    {related.length > 0 && <section className="space-y-5 border-t border-border pt-8">
      <h2 className="text-xl font-bold">Món khác bạn có thể thích</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-4">{related.map((item) => <DishCard key={item.slug} dish={item} />)}</div>
    </section>}

    {cooking && <CookingMode dish={dish} step={cookingStep} setStep={setCookingStep} close={() => setCooking(false)} />}
  </div>;
}

function TravelPanel({ dish }: { dish: Dish }) {
  const profile = [
    { key: "sweet", label: "Ngọt" }, { key: "salty", label: "Mặn" }, { key: "rich", label: "Béo" }, { key: "crunchy", label: "Giòn" },
  ] as const;
  return <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
    <InfoBlock title="Nguồn gốc" icon={<MapPin />}><p>{dish.origin}</p></InfoBlock>
    <InfoBlock title="Hương vị" icon={<Sparkles />}>
      <p>{dish.flavor}</p>
      <div className="mt-5 space-y-3">{profile.map(({ key, label }) => {
        const value = Math.max(0, Math.min(5, dish.flavorProfile[key]));
        return <div key={key} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3 text-sm"><span>{label}</span><div className="flex gap-1" role="img" aria-label={`${label}: ${value} trên 5`}>{[1, 2, 3, 4, 5].map((segment) => <span key={segment} className={`h-2.5 flex-1 rounded-sm border border-primary ${segment <= value ? "bg-primary" : "bg-background"}`} />)}</div><span className="text-right tabular-nums text-muted-foreground">{value}/5</span></div>;
      })}</div>
    </InfoBlock>
    <InfoBlock title="Nên ăn ở đâu" icon={<MapPin />}><p>{dish.whereToEat.region}</p></InfoBlock>
    <InfoBlock title="Khi nào ăn ngon" icon={<Clock3 />}><p>{dish.whereToEat.bestTime}</p></InfoBlock>
    <InfoBlock title="Mẹo nhỏ" icon={<Utensils />}><p>{dish.whereToEat.tip}</p></InfoBlock>
  </div>;
}

function FactsPanel({ dish }: { dish: Dish }) {
  return <div className="max-w-3xl divide-y divide-border">
    {dish.funFacts.map((fact) => <p key={fact} className="py-7 text-lg leading-relaxed text-foreground first:pt-2 sm:text-xl">{fact}</p>)}
  </div>;
}

function CookPanel({ dish, servings, setServings, checkedIngredients, setIngredient, clearIngredients, doneSteps, toggleStep, startCooking }: {
  dish: Dish;
  servings: number;
  setServings: (next: number) => void;
  checkedIngredients: string[];
  setIngredient: (index: number, checked: boolean) => void;
  clearIngredients: () => void;
  doneSteps: number[];
  toggleStep: (index: number) => void;
  startCooking: () => void;
}) {
  const checkedCount = checkedIngredients.length;
  return <div className="space-y-10">
    <div className="flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-border py-5">
      <span className="flex items-center gap-2 text-sm"><Clock3 className="size-4 text-primary" /><strong>{dish.cookTime} phút</strong></span>
      <div className="flex items-center gap-2 text-sm"><span>Số phần</span><Button type="button" variant="outline" size="icon" aria-label="Giảm số phần" className="h-9 w-9" onClick={() => setServings(Math.max(1, servings - 1))} disabled={servings <= 1}><Minus /></Button><span className="min-w-6 text-center font-semibold tabular-nums">{servings}</span><Button type="button" variant="outline" size="icon" aria-label="Tăng số phần" className="h-9 w-9" onClick={() => setServings(Math.min(20, servings + 1))} disabled={servings >= 20}><Plus /></Button></div>
      <span className="text-sm">Độ khó: <strong>{dish.difficulty}</strong></span>
    </div>
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h2 className="text-xl font-bold">Nguyên liệu</h2><p className="mt-1 text-sm text-muted-foreground" aria-live="polite">{checkedCount}/{dish.ingredients.length} đã chuẩn bị</p></div><Button type="button" variant="ghost" className="min-h-11 px-2 text-muted-foreground" onClick={clearIngredients} disabled={checkedCount === 0}>Bỏ chọn tất cả</Button></div>
      <div className="divide-y divide-border border-y border-border">{dish.ingredients.map((item, index) => {
        const checked = checkedIngredients.includes(String(index));
        return <label key={`${item.name}-${index}`} className="flex min-h-14 cursor-pointer items-center gap-4 py-3">
          <Checkbox checked={checked} onCheckedChange={(value) => setIngredient(index, value === true)} aria-label={`${checked ? "Bỏ chọn" : "Đã chuẩn bị"}: ${item.name}`} className="h-5 w-5 rounded-sm" />
          <span className={`flex-1 text-sm transition-opacity ${checked ? "text-muted-foreground line-through opacity-60" : "text-foreground"}`}>{item.name}</span>
          <span className="text-sm tabular-nums text-muted-foreground">{scaleIngredientAmount(item.amount, dish.servings, servings)}</span>
        </label>;
      })}</div>
    </section>
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Cách làm</h2><Button type="button" onClick={startCooking}><ChefHat />Bắt đầu nấu</Button></div>
      <ol className="space-y-3">{dish.steps.map((step, index) => {
        const complete = doneSteps.includes(index);
        return <li key={`${index}-${step}`}><Button type="button" variant="ghost" aria-pressed={complete} onClick={() => toggleStep(index)} className="h-auto min-h-14 w-full justify-start gap-4 whitespace-normal rounded-lg px-3 py-3 text-left">
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${complete ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground"}`}>{complete ? <Check className="size-4" /> : index + 1}</span>
          <span className={`text-sm leading-relaxed ${complete ? "text-muted-foreground line-through" : "text-foreground"}`}>{step}</span>
        </Button></li>;
      })}</ol>
    </section>
  </div>;
}

function InfoBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="space-y-3 border-b border-border pb-5">
    <h2 className="flex items-center gap-2 text-base font-semibold"><span className="text-primary">{icon}</span>{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>;
}

function CookingMode({ dish, step, setStep, close }: { dish: Dish; step: number; setStep: (step: number) => void; close: () => void }) {
  const touchStart = useRef<number | null>(null);
  const lastStep = dish.steps.length - 1;
  const complete = () => {
    close();
    toast.success("Chúc ngon miệng!");
  };
  return <div role="dialog" aria-modal="true" aria-label={`Chế độ nấu ${dish.nameVi}`} className="fixed inset-0 z-[80] flex min-h-dvh flex-col bg-background px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-[max(env(safe-area-inset-top),1rem)] md:px-12">
    <header className="flex items-center justify-between border-b border-border pb-4"><div><p className="text-sm text-muted-foreground">{dish.nameVi}</p><h2 className="font-semibold">Bước {step + 1} / {dish.steps.length}</h2></div><Button type="button" variant="ghost" size="icon" aria-label="Đóng chế độ nấu" onClick={close}><X /></Button></header>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Tiến độ nấu" aria-valuemin={1} aria-valuemax={dish.steps.length} aria-valuenow={step + 1}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / dish.steps.length) * 100}%` }} /></div>
    <main className="flex flex-1 touch-pan-y items-center justify-center py-8" onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientX;
      touchStart.current = null;
      if (start === null || end === undefined || Math.abs(end - start) < 60) return;
      setStep(Math.max(0, Math.min(lastStep, step + (start > end ? 1 : -1))));
    }}><p className="max-w-4xl text-center text-3xl font-semibold leading-relaxed text-foreground md:text-5xl">{dish.steps[step]}</p></main>
    <footer className="grid grid-cols-2 gap-3 border-t border-border pt-4"><Button type="button" variant="outline" className="min-h-14" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Quay lại</Button>{step === lastStep ? <Button type="button" className="min-h-14" onClick={complete}>Hoàn thành</Button> : <Button type="button" className="min-h-14" onClick={() => setStep(Math.min(lastStep, step + 1))}>Bước tiếp<ArrowRight /></Button>}</footer>
  </div>;
}

function isTabId(value: string | undefined): value is TabId {
  return value === "travel" || value === "facts" || value === "cook";
}