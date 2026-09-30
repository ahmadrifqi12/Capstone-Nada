export type Shape = "gamis" | "abaya" | "khimar" | "set" | "outer";

export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  category: "Gamis" | "Abaya" | "Khimar" | "Set" | "Outer";
  shape: Shape;
  collection: string; // collection slug
  price: number;
  description: string;
  material: string;
  care: string;
  colors: Color[];
  sizes: string[];
  /** stock keyed by "color|size" — missing key means out of stock */
  stock: Record<string, number>;
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  createdAt: string;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  launch: string;
  tone: string;
  storyTitle: string;
  story: { heading?: string; body: string }[];
  details: { label: string; value: string }[];
}
