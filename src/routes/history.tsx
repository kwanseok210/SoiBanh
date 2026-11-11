import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Trash2 } from "lucide-react";
import { APP_NAME } from "@/config";
import { PageHeader, Skeleton } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/app-ui";
import { deleteHistory, getHistory } from "@/api/history";
import type { HistoryItem } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { sampleResults } from "@/data/sampleResults";
import { dishes } from "@/data/dishes";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [
    { title: `Lịch sử — ${APP_NAME}` }, { name: "description", content: "Xem lại những món bánh đã khám phá cùng Soi Bánh." },
    { property: "og:title", content: `Lịch sử — ${APP_NAME}` }, { property: "og:description", content: "Xem lại những món bánh đã khám phá cùng Soi Bánh." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    let active = true;
    if (user) {
      setFetching(true);
      void getHistory().then((next) => { if (active) setItems(next); }).finally(() => { if (active) setFetching(false); });
    } else setItems([]);
    return () => { active = false; };
  }, [user]);
  async function remove(id: string) {
    try {
      await deleteHistory(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      toast.error("Chưa xóa được mục này. Hãy thử lại.");
    }
  }
  if (loading) return <div className="space-y-6"><Skeleton className="h-10 w-56"/><Skeleton className="h-52 w-full"/></div>;
  if (!user) return <div className="mx-auto max-w-xl py-10"><EmptyState title="Đăng nhập để xem lịch sử" description="Lịch sử những món bánh bạn đã khám phá sẽ được lưu tại đây." action={<Button asChild><Link to="/login" search={{ returnTo: "/history" }}>Đăng nhập</Link></Button>} /></div>;
  return <div className="space-y-8"><PageHeader title="Lịch sử" subtitle="Những món bánh bạn đã khám phá." />{fetching ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((n) => <Skeleton key={n} className="h-48" />)}</div> : items.length ? <div className="divide-y divide-border border-y border-border">{items.map((item) => { const sample = sampleResults.find((entry) => entry.id === item.sampleResultId); const dish = dishes.find((entry) => entry.slug === sample?.dishSlug); return <div key={item.id} className="flex items-center justify-between gap-3 py-4"><Link to="/analyze" search={{ sample: item.sampleResultId }} className="flex min-w-0 items-center gap-3"><Clock3 className="size-5 shrink-0 text-muted-foreground"/><span className="min-w-0"><span className="block truncate text-sm font-medium">{dish?.nameVi ?? item.sampleResultId}</span><span className="block text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("vi-VN")}</span></span></Link><Button variant="ghost" size="icon" aria-label="Xóa khỏi lịch sử" onClick={() => void remove(item.id)}><Trash2 /></Button></div>; })}</div> : <EmptyState title="Chưa có món bánh nào được lưu" description="Kết quả bạn lưu sau khi phân tích ảnh sẽ xuất hiện tại đây." action={<Button asChild><Link to="/analyze">Phân tích ảnh<ArrowRight /></Link></Button>} />}</div>;
}
