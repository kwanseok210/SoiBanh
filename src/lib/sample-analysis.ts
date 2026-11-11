import type { Component } from "@/types";

export const MAX_ANALYSIS_IMAGE_BYTES = 10 * 1024 * 1024;

export function validateAnalysisImage(file: Pick<File, "type" | "size">): "unsupported_type" | "file_too_large" | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "unsupported_type";
  if (file.size > MAX_ANALYSIS_IMAGE_BYTES) return "file_too_large";
  return null;
}

export type ComponentGroup = {
  label: string;
  colorIndex: number;
  components: Component[];
  bestScore: number;
};

export function visibleComponents(
  components: Component[],
  imageWidth: number,
  imageHeight: number,
): Component[] {
  return components.filter((component) => {
    const { box } = component;
    const [left, top, right, bottom] = box;
    const width = right - left;
    const height = bottom - top;
    return width > 0 && height > 0 && width * height <= 0.85 * imageWidth * imageHeight;
  });
}

export function groupComponents(components: Component[]): ComponentGroup[] {
  const byLabel = new Map<string, Component[]>();
  for (const component of components) {
    const group = byLabel.get(component.label) ?? [];
    group.push(component);
    byLabel.set(component.label, group);
  }

  return Array.from(byLabel, ([label, grouped]) => ({
    label,
    components: grouped,
    bestScore: Math.max(...grouped.map((component) => component.score)),
    colorIndex: 0,
  }))
    .sort((a, b) => b.bestScore - a.bestScore)
    .map((group, colorIndex) => ({ ...group, colorIndex }));
}