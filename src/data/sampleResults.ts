import type { SampleResult } from "@/types";
import banhKhotImage from "@/assets/soi-banh/banh_khot.jpg";
import banhMiImage from "@/assets/soi-banh/banh_mi.jpg";
import banhXeoImage from "@/assets/soi-banh/banh_xeo.jpg";

export const DATA_COLORS = [
  "var(--color-data-1)",
  "var(--color-data-2)",
  "var(--color-data-3)",
  "var(--color-data-4)",
  "var(--color-data-5)",
  "var(--color-data-6)",
];

export const sampleResults: SampleResult[] = [
  {
    id: "bk-01",
    image: banhKhotImage,
    imageWidth: 1024,
    imageHeight: 1024,
    dishSlug: "banh_khot",
    dishConfidence: 1,
    components: [
      { label: "Bánh khọt", score: 0.3933, box: [288, 451, 662, 694] },
      { label: "Mỡ hành", score: 0.3438, box: [717, 19, 1022, 286] },
      { label: "Bánh khọt", score: 0.3059, box: [288, 286, 484, 506] },
      { label: "Tôm chín", score: 0.2812, box: [490, 707, 569, 842] },
      { label: "Bánh khọt", score: 0.281, box: [290, 679, 491, 962] },
      { label: "Tôm chín", score: 0.2801, box: [621, 708, 677, 851] },
      { label: "Bánh khọt", score: 0.2795, box: [602, 326, 804, 538] },
    ],
  },
  {
    id: "bx-01",
    image: banhXeoImage,
    imageWidth: 1024,
    imageHeight: 1024,
    dishSlug: "banh_xeo",
    dishConfidence: 0.982,
    components: [
      { label: "Bánh xèo", score: 0.72, box: [111, 264, 430, 700] },
      { label: "Tôm chín", score: 0.63, box: [527, 321, 728, 544] },
      { label: "Giá đỗ", score: 0.54, box: [223, 587, 453, 798] },
      { label: "Rau thơm", score: 0.47, box: [736, 183, 939, 562] },
    ],
  },
  {
    id: "bm-01",
    image: banhMiImage,
    imageWidth: 1024,
    imageHeight: 1024,
    dishSlug: "banh_mi",
    dishConfidence: 0.964,
    components: [
      { label: "Bánh mì", score: 0.69, box: [140, 283, 885, 738] },
      { label: "Rau thơm", score: 0.52, box: [318, 351, 528, 530] },
      { label: "Đồ chua", score: 0.48, box: [471, 407, 645, 599] },
      { label: "Thịt", score: 0.4, box: [624, 371, 802, 622] },
      { label: "Dưa leo", score: 0.35, box: [298, 515, 674, 662] },
    ],
  },
];