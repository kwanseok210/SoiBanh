export type User = { id: string; name: string; email: string; createdAt: string };

export type Dish = {
  slug: string;
  nameVi: string;
  nameEn: string;
  tags: ("Mặn" | "Ngọt")[];
  summary: string;
  image: string;
  origin: string;
  flavor: string;
  flavorProfile: { sweet: number; salty: number; rich: number; crunchy: number };
  whereToEat: { region: string; bestTime: string; tip: string };
  funFacts: string[];
  ingredients: { name: string; amount: string }[];
  steps: string[];
  cookTime: number;
  servings: number;
  difficulty: "Dễ" | "Vừa" | "Khó";
};

export type Component = {
  label: string;
  score: number;
  box: [number, number, number, number];
};

export type SampleResult = {
  id: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  dishSlug: string;
  dishConfidence: number;
  components: Component[];
};

export type HistoryItem = {
  id: string;
  userId: string;
  sampleResultId: string;
  createdAt: string;
};