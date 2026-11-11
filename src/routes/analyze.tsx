import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookmarkPlus, RotateCcw, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { addHistory } from "@/api/history";
import { APP_NAME } from "@/config";
import { AnalysisIntroIcon, AnalysisProgress, BoxOverlay, DropZone, SamplePicker, ScanFrame } from "@/components/sample-analysis";
import { ConfidenceMeter, EmptyState, PageHeader } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { dishes } from "@/data/dishes";
import { DATA_COLORS, sampleResults } from "@/data/sampleResults";
import { groupComponents, validateAnalysisImage } from "@/lib/sample-analysis";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { SampleResult } from "@/types";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>): { sample?: string } => {
    const sample = search["sample"];
    return typeof sample === "string" ? { sample } : {};
  },
  head: () => ({ meta: [
    { title: `Phân tích ảnh — ${APP_NAME}` },
    { name: "description", content: "Xem kết quả minh họa nhận diện món bánh và nguyên liệu Việt Nam." },
    { property: "og:title", content: `Phân tích ảnh — ${APP_NAME}` },
    { property: "og:description", content: "Xem kết quả minh họa nhận diện món bánh và nguyên liệu Việt Nam." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const { sample: sampleId } = Route.useSearch();
  const navigate = useNavigate();
  const { requireAuth, user } = useAuth();
  const [uploaded, setUploaded] = useState<{ url: string; name: string } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(sampleId);
  const [isScanningSample, setIsScanningSample] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const selectedSample = sampleResults.find((sample) => sample.id === selectedSampleId) ?? null;

  useEffect(() => {
    if (!uploaded) return;
    return () => URL.revokeObjectURL(uploaded.url);
  }, [uploaded]);

  useEffect(() => {
    setSelectedIngredient(null);
  }, [selectedSample?.id]);

  useEffect(() => {
    if (!isScanningSample || !selectedSample) return;
    const advanceTimer = window.setTimeout(() => setAnalysisStep(1), 1200);
    const finishTimer = window.setTimeout(() => setIsScanningSample(false), 2600);
    return () => {
      window.clearTimeout(advanceTimer);
      window.clearTimeout(finishTimer);
    };
  }, [isScanningSample, selectedSample?.id]);

  useEffect(() => {
    if (!selectedIngredient) return;
    const clearSelectionOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIngredient(null);
    };
    window.addEventListener("keydown", clearSelectionOnEscape);
    return () => window.removeEventListener("keydown", clearSelectionOnEscape);
  }, [selectedIngredient]);

  const dish = useMemo(
    () => selectedSample ? dishes.find((item) => item.slug === selectedSample.dishSlug) ?? null : null,
    [selectedSample],
  );
  const groups = useMemo(
    () => selectedSample ? groupComponents(selectedSample.components) : [],
    [selectedSample],
  );

  function chooseSample(sample: SampleResult) {
    setUploaded(null);
    setUploadError("");
    setSelectedIngredient(null);
    setSelectedSampleId(sample.id);
    setAnalysisStep(0);
    setIsScanningSample(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    void navigate({ to: "/analyze", search: { sample: sample.id }, replace: true });
  }

  function handleUpload(file: File) {
    const issue = validateAnalysisImage(file);
    if (issue === "unsupported_type") {
      setUploadError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
      return;
    }
    if (issue === "file_too_large") {
      setUploadError("Ảnh cần có dung lượng không quá 10 MB.");
      return;
    }
    setSelectedIngredient(null);
    setSelectedSampleId(undefined);
    setIsScanningSample(false);
    void navigate({ to: "/analyze", search: {}, replace: true });
    setUploaded({ url: URL.createObjectURL(file), name: file.name });
  }

  function saveResult() {
    if (!selectedSample || saving) return;
    requireAuth(() => {
      setSaving(true);
      void addHistory(selectedSample.id)
        .then(() => toast.success("Đã lưu kết quả vào lịch sử"))
        .catch(() => toast.error("Chưa lưu được kết quả. Hãy thử lại."))
        .finally(() => setSaving(false));
    });
  }

  return <div className="space-y-8">
    <PageHeader title="Phân tích món bánh" subtitle="Chọn ảnh mẫu để xem kết quả minh họa hoặc tải ảnh của bạn lên." />

    <div role="note" className="flex items-start gap-3 border-y border-amber/40 bg-secondary/60 px-4 py-4 text-sm text-foreground">
      <AnalysisIntroIcon />
      <p className="pt-1 leading-relaxed">Nhận diện trực tiếp ảnh tải lên chưa được bật. Kết quả dưới đây là dữ liệu mẫu có sẵn, không phải phân tích ảnh của bạn.</p>
    </div>

    {uploaded && <section className="grid gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] md:items-center">
      <div className="space-y-3">
        <ScanFrame scanning={false} className="aspect-[4/3] rounded-lg bg-muted md:aspect-[16/10]">
          <img src={uploaded.url} alt={`Ảnh bạn tải lên: ${uploaded.name}`} className="absolute inset-0 size-full object-contain" />
        </ScanFrame>
        <p className="truncate text-sm font-medium text-foreground">{uploaded.name}</p>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Ảnh đã sẵn sàng</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Ảnh này chỉ được xem trong phiên hiện tại. Để khám phá phần kết quả, hãy chọn một ảnh mẫu bên dưới.</p>
        <Button type="button" variant="outline" onClick={() => setUploaded(null)}><RotateCcw />Chọn ảnh khác</Button>
      </div>
    </section>}

    {selectedSample && dish && isScanningSample ? <section className="grid gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] md:items-center" aria-label="Đang phân tích ảnh mẫu">
      <ScanFrame scanning className="aspect-square rounded-lg bg-muted sm:aspect-[4/3]">
        <img src={selectedSample.image} alt={`Ảnh mẫu ${dish.nameVi}`} className="absolute inset-0 size-full object-contain" />
      </ScanFrame>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Đang phân tích ảnh mẫu</h2>
        <AnalysisProgress step={analysisStep} />
      </div>
    </section> : null}

    {selectedSample && dish && !isScanningSample ? <section className="space-y-6 border-b border-border pb-8" aria-labelledby="sample-result-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">Kết quả mẫu · {selectedSample.id}</p>
          <h2 id="sample-result-title" className="text-2xl font-extrabold text-foreground">{dish.nameVi}</h2>
          <p className="text-sm text-muted-foreground">Món ăn nhận diện trong bộ dữ liệu minh họa</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => { setSelectedIngredient(null); setSelectedSampleId(undefined); void navigate({ to: "/analyze", search: {}, replace: true }); }}><RotateCcw />Chọn ảnh khác</Button>
          <Button type="button" onClick={saveResult} disabled={saving}><BookmarkPlus />{saving ? "Đang lưu" : "Lưu lịch sử"}</Button>
        </div>
      </div>
      {!user && <p className="text-sm text-muted-foreground">Đăng nhập để lưu kết quả vào lịch sử.</p>}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:items-start">
        <ScanFrame scanning={false} className="aspect-square rounded-lg bg-muted sm:aspect-[4/3]">
          <img src={selectedSample.image} alt={`Ảnh mẫu ${dish.nameVi}`} className="absolute inset-0 size-full object-contain" />
          <BoxOverlay sample={selectedSample} groups={groups} selected={selectedIngredient} onSelect={(label) => setSelectedIngredient(label || null)} animated={false} />
        </ScanFrame>
        <div className="space-y-5">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"><ScanSearch className="size-5" /></span><div><h3 className="font-bold">Thành phần trong mẫu</h3><p className="text-xs text-muted-foreground">Thông tin minh họa dựng sẵn</p></div></div>
          <ConfidenceMeter value={selectedSample.dishConfidence} showNumber />
          <ul className="divide-y divide-border border-y border-border">
            {groups.map((group) => <li key={group.label}>
              <Button type="button" variant="ghost" aria-pressed={selectedIngredient === group.label} onClick={() => setSelectedIngredient((current) => current === group.label ? null : group.label)} className={cn("flex min-h-12 w-full justify-between gap-3 rounded-none px-2 py-3 text-left", selectedIngredient === group.label && "bg-accent text-accent-foreground")}>
                <span className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: DATA_COLORS[group.colorIndex] }} /><span className="truncate text-sm font-medium">{group.label}</span></span>
                <span className="shrink-0 text-xs text-muted-foreground">{Math.round(group.bestScore * 100)}%</span>
              </Button>
            </li>)}
          </ul>
          <Button variant="ghost" asChild className="px-0"><Link to="/library/$slug" params={{ slug: dish.slug }}>Tìm hiểu {dish.nameVi}<ArrowRight /></Link></Button>
        </div>
      </div>
    </section> : null}

    {!selectedSample && !uploaded && <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] lg:items-start">
      <section className="space-y-4">
        <div className="space-y-1"><h2 className="text-lg font-bold">Ảnh của bạn</h2><p className="text-sm text-muted-foreground">Xem trước ảnh trên thiết bị của bạn.</p></div>
        <DropZone onUpload={handleUpload} error={uploadError} resetError={() => setUploadError("")} />
      </section>
      <section className="space-y-4">
        <div className="space-y-1"><h2 className="text-lg font-bold">Thử ảnh mẫu</h2><p className="text-sm text-muted-foreground">Chọn ảnh để xem kết quả nhận diện dựng sẵn.</p></div>
        <SamplePicker samples={sampleResults} onChoose={chooseSample} />
      </section>
    </div>}

    {(selectedSample || uploaded) && <section className="space-y-4" aria-labelledby="more-samples-title">
      <div className="flex flex-wrap items-end justify-between gap-3"><div className="space-y-1"><h2 id="more-samples-title" className="text-lg font-bold">Thử ảnh mẫu khác</h2><p className="text-sm text-muted-foreground">Các kết quả đều là dữ liệu mẫu minh họa.</p></div><Button variant="ghost" asChild><Link to="/library">Mở thư viện bánh<ArrowRight /></Link></Button></div>
      <SamplePicker samples={sampleResults} onChoose={chooseSample} compact />
    </section>}

    {!selectedSample && !uploaded && sampleResults.length === 0 && <EmptyState title="Chưa có ảnh mẫu" description="Bạn có thể xem lại thư viện bánh trong lúc chờ dữ liệu mẫu." action={<Button asChild><Link to="/library">Mở thư viện bánh</Link></Button>} />}
  </div>;
}