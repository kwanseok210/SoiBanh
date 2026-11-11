import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Check, ImagePlus, Info, LoaderCircle, ScanSearch, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/app-ui";
import { dishes } from "@/data/dishes";
import { DATA_COLORS } from "@/data/sampleResults";
import type { SampleResult } from "@/types";
import { groupComponents, visibleComponents, type ComponentGroup } from "@/lib/sample-analysis";
import { cn } from "@/lib/utils";

export function SamplePhoto({ sample, className, eager = false }: { sample: SampleResult; className?: string; eager?: boolean }) {
  const dish = getDishFromSample(sample.dishSlug);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [sample.image]);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!failed ? <img src={sample.image} alt={dish?.nameVi ?? "Ảnh món bánh"} loading={eager ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} /> : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted px-4 text-center text-muted-foreground">
          <span className="flex size-10 items-center justify-center rounded-full bg-background/80"><ImagePlus className="size-5" /></span>
          <span className="font-semibold text-foreground">{dish?.nameVi ?? "Ảnh mẫu"}</span>
          <span className="text-xs">Ảnh mẫu đang được cập nhật</span>
        </div>
      )}
      <span className="sr-only">{dish?.nameVi ?? "Ảnh mẫu"}</span>
    </div>
  );
}

function getDishFromSample(slug: string) {
  return dishes.find((dish) => dish.slug === slug) ?? null;
}

function getGroupColors(index: number) {
  return DATA_COLORS[index % DATA_COLORS.length];
}

export function BoxOverlay({ sample, groups, selected, visible = true, onSelect, animated = true }: {
  sample: SampleResult;
  groups: ComponentGroup[];
  selected: string | null;
  visible?: boolean;
  onSelect?: (label: string) => void;
  animated?: boolean;
}) {
  const validGroups = useMemo(() => groups.map((group) => ({
    ...group,
    components: visibleComponents(group.components, sample.imageWidth, sample.imageHeight),
  })).filter((group) => group.components.length > 0), [groups, sample.imageHeight, sample.imageWidth]);
  const ordered = validGroups.flatMap((group, groupIndex) => group.components.map((component, regionIndex) => ({ group, groupIndex, component, regionIndex })));
  return (
    <svg className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${sample.imageWidth} ${sample.imageHeight}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Khung nguyên liệu được nhận diện">
      <rect x="0" y="0" width={sample.imageWidth} height={sample.imageHeight} fill="transparent" onClick={() => onSelect?.("")} className="cursor-pointer" />
      {ordered.map(({ group, groupIndex, component, regionIndex }, index) => {
        const [left, top, right, bottom] = component.box;
        const active = selected === group.label;
        const dimmed = selected !== null && !active;
        const color = getGroupColors(group.colorIndex);
        const rect = <rect x={left} y={top} width={right - left} height={bottom - top} rx="6" fill={color} fillOpacity={active ? "0.08" : "0.02"} stroke={color} strokeWidth={active ? "4" : "2.5"} vectorEffect="non-scaling-stroke" strokeDasharray="1" pathLength="1" className={animated ? "analysis-box-draw" : undefined} style={{ opacity: dimmed ? 0.25 : 1, animationDelay: `${index * 60}ms` }} />;
        return (
          <g key={`${group.label}-${regionIndex}`} className="cursor-pointer transition-opacity" opacity={dimmed ? 0.25 : 1} onClick={(event) => { event.stopPropagation(); onSelect?.(active ? "" : group.label); }} role="button" tabIndex={0} aria-label={`${group.label}, vùng ${regionIndex + 1}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect?.(active ? "" : group.label); } }}>
            {rect}
            <g transform={`translate(${Math.max(0, left)},${Math.max(0, top)})`}>
              <rect x="0" y="0" width="28" height="28" rx="8" fill={color} />
              <text x="14" y="19" textAnchor="middle" fill="var(--background)" fontSize="15" fontWeight="700">{groupIndex + 1}</text>
            </g>
            {active && regionIndex === 0 && <g transform={`translate(${Math.max(0, left)},${Math.max(0, top - 38)})`}><rect width="160" height="30" rx="8" fill="var(--foreground)"/><text x="12" y="20" fill="var(--background)" fontSize="15" fontWeight="600">{group.label}, {component.score < 0.3 ? "Thấp" : component.score <= 0.6 ? "Vừa" : "Cao"}</text></g>}
          </g>
        );
      })}
      {!visible && selected === null && <rect x="0" y="0" width={sample.imageWidth} height={sample.imageHeight} fill="transparent" />}
      {!visible && selected !== null && <g>{ordered.filter(({ group }) => group.label !== selected).map(({ group, component, regionIndex }) => { const [left, top, right, bottom] = component.box; return <rect key={`hidden-${group.label}-${regionIndex}`} x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke="none" />; })}</g>}
    </svg>
  );
}

export function ScanFrame({ scanning, children, className }: { scanning: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-3 top-3 size-7 border-l-2 border-t-2 border-primary" />
        <span className="absolute right-3 top-3 size-7 border-r-2 border-t-2 border-primary" />
        <span className="absolute bottom-3 left-3 size-7 border-b-2 border-l-2 border-primary" />
        <span className="absolute bottom-3 right-3 size-7 border-b-2 border-r-2 border-primary" />
        {scanning && <span className="analysis-scan-line absolute left-0 top-0 h-4 w-full" />}
      </div>
    </div>
  );
}

export function SamplePicker({ samples, onChoose, compact = false }: { samples: SampleResult[]; onChoose: (sample: SampleResult) => void; compact?: boolean }) {
  const dishOptions = useMemo(() => Array.from(new Set(samples.map((sample) => getDishFromSample(sample.dishSlug)?.nameVi ?? sample.dishSlug))), [samples]);
  const [filter, setFilter] = useState("Tất cả");
  const filtered = samples.filter((sample) => filter === "Tất cả" || (getDishFromSample(sample.dishSlug)?.nameVi ?? sample.dishSlug) === filter);
  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Lọc ảnh theo món">
        {["Tất cả", ...dishOptions].map((name) => <Chip key={name} selected={filter === name} onClick={() => setFilter(name)}>{name}</Chip>)}
      </div>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", compact && "gap-2")}>
        {filtered.map((sample) => {
          const dish = getDishFromSample(sample.dishSlug);
          return <Button key={sample.id} type="button" variant="ghost" onClick={() => onChoose(sample)} className="group h-auto min-w-0 flex-col items-stretch whitespace-normal rounded-lg border border-border bg-card p-2 text-left transition-[border-color,transform] hover:border-primary focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]" aria-label={`Chọn ảnh mẫu ${dish?.nameVi ?? sample.dishSlug}`}>
            <SamplePhoto sample={sample} className={cn("aspect-[4/3] w-full rounded-md transition-transform group-hover:scale-[1.01]", compact && "aspect-[16/10]")} />
            <span className="px-1 pt-1 text-sm font-semibold text-foreground">{dish?.nameVi ?? sample.dishSlug}</span>
          </Button>;
        })}
      </div>
    </div>
  );
}

export function DropZone({ onUpload, error, resetError }: { onUpload: (file: File) => void; error: string; resetError: () => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.items ?? []).find((item) => item.type.startsWith("image/"))?.getAsFile();
      if (file) { event.preventDefault(); onUpload(file); }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onUpload]);
  const acceptFile = (file?: File) => {
    if (!file) return;
    resetError();
    onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <section onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files[0]); }} className={cn("flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 border-y-2 border-dashed px-5 py-10 text-center transition-colors sm:rounded-lg sm:border", dragging ? "border-solid border-primary bg-primary/5" : "border-border bg-card/40")} role="button" tabIndex={0} onClick={(event) => { if (event.target !== inputRef.current) inputRef.current?.click(); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => acceptFile(event.target.files?.[0])} aria-label="Chọn ảnh từ thiết bị" />
      <span className={cn("flex size-14 items-center justify-center rounded-full transition-colors", dragging ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>{dragging ? <Upload className="size-6" /> : <Camera className="size-6" />}</span>
      <span className="space-y-2">
        <span className="block text-xl font-bold text-foreground">{dragging ? "Thả ảnh để bắt đầu" : "Kéo ảnh vào đây hoặc bấm để chọn ảnh"}</span>
        <span className="block text-sm text-muted-foreground">JPG, PNG hoặc WebP, tối đa 10 MB</span>
      </span>
      {error && <span role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</span>}
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Info className="size-3.5" />Ảnh tải lên chỉ giữ trong phiên này</span>
      <span className="sr-only">{dragging ? "Đang kéo ảnh vào vùng chọn" : "Mở thư viện ảnh hoặc máy ảnh"}</span>
    </section>
  );
}

export function AnalysisProgress({ step }: { step: number }) {
  const stages = ["Nhận diện món ăn", "Tìm nguyên liệu trên ảnh"];
  return <ol className="space-y-4" aria-live="polite" aria-atomic="false">
    {stages.map((stage, index) => <li key={stage} className="flex items-center gap-3" aria-current={step === index ? "step" : undefined}>
      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", index < step ? "bg-leaf/10 text-leaf" : index === step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
        {index < step ? <Check className="size-4" /> : index === step ? <LoaderCircle className="size-4 animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span className={cn("text-sm", index === step ? "font-semibold text-foreground" : "text-muted-foreground")}>{stage}</span>
    </li>)}
  </ol>;
}

export function AnalysisIntroIcon() {
  return <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"><ScanSearch className="size-5" /></span>;
}

export function SampleChoiceLink({ sample }: { sample: SampleResult }) {
  return <Link to="/analyze" search={{ sample: sample.id }} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline">Phân tích ảnh này<ArrowRight className="size-4" /></Link>;
}