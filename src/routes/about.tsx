import { createFileRoute } from "@tanstack/react-router";
import { Heart, ScanLine, Utensils } from "lucide-react";
import { APP_NAME } from "@/config";
import { PageHeader } from "@/components/app-ui";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `Về dự án — ${APP_NAME}` },
    { name: "description", content: "Tìm hiểu về dự án khám phá món bánh Việt Soi Bánh." },
    { property: "og:title", content: `Về dự án — ${APP_NAME}` },
    { property: "og:description", content: "Tìm hiểu về dự án khám phá món bánh Việt Soi Bánh." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  return <div className="space-y-12">
    <PageHeader title={`Về ${APP_NAME}`} subtitle="Một góc nhỏ dành cho những món bánh thân thuộc của Việt Nam." />
    <div className="grid gap-0 border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
      <section className="space-y-3 border-b border-border py-6 sm:border-0 sm:px-6 sm:first:pl-0"><ScanLine className="size-6 text-primary"/><h2 className="font-semibold">Nhìn bằng hình ảnh</h2><p className="text-sm leading-relaxed text-muted-foreground">Bắt đầu từ một bức ảnh và tìm hiểu thêm về món ăn phía sau nó.</p></section>
      <section className="space-y-3 border-b border-border py-6 sm:border-0 sm:px-6"><Utensils className="size-6 text-leaf"/><h2 className="font-semibold">Giữ gìn vị Việt</h2><p className="text-sm leading-relaxed text-muted-foreground">Ghi lại tên gọi, nguyên liệu và nét riêng của các món bánh nhiều vùng miền.</p></section>
      <section className="space-y-3 py-6 sm:px-6 sm:pr-0"><Heart className="size-6 text-amber"/><h2 className="font-semibold">Chia sẻ sự tò mò</h2><p className="text-sm leading-relaxed text-muted-foreground">Cùng khám phá những hương vị gợi nhớ những bữa ăn thân quen.</p></section>
    </div>
  </div>;
}
