import { describe, expect, it } from "vitest";
import { dishes } from "@/data/dishes";
import { sampleResults } from "@/data/sampleResults";
import { filterDishes, scaleIngredientAmount } from "@/lib/dish-search";
import { groupComponents, MAX_ANALYSIS_IMAGE_BYTES, validateAnalysisImage } from "@/lib/sample-analysis";

describe("migrated Soi Bánh behavior", () => {
  it("keeps the ten Vietnamese cake entries from the archive", () => {
    expect(dishes).toHaveLength(10);
  });

  it("searches Vietnamese names without requiring accent marks", () => {
    expect(filterDishes(dishes, "banh mi", "Tất cả").map((dish) => dish.slug)).toContain("banh_mi");
  });

  it("filters the library to sweet dishes only", () => {
    expect(filterDishes(dishes, "", "Ngọt").every((dish) => dish.tags.includes("Ngọt"))).toBe(true);
  });

  it("scales a recipe ingredient amount with serving count", () => {
    expect(scaleIngredientAmount("200 g", 4, 2)).toBe("100 g");
  });

  it("accepts the source image types up to the 10 MB upload limit", () => {
    expect(MAX_ANALYSIS_IMAGE_BYTES).toBe(10 * 1024 * 1024);
    expect(validateAnalysisImage({ type: "image/webp", size: MAX_ANALYSIS_IMAGE_BYTES })).toBeNull();
    expect(validateAnalysisImage({ type: "image/jpeg", size: MAX_ANALYSIS_IMAGE_BYTES + 1 })).toBe("file_too_large");
  });

  it("keeps upload previews separate from the fixed sample-analysis results", () => {
    expect(sampleResults.map((sample) => sample.id)).toEqual(["bk-01", "bx-01", "bm-01"]);
    expect(groupComponents(sampleResults[1]?.components ?? []).map((group) => group.label)).toContain("Bánh xèo");
  });
});
