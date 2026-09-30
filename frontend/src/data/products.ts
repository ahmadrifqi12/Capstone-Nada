import type { Color, Product } from "./types";

const c = {
  krem: { name: "Krem Pasir", hex: "#d8c6a5" },
  terakota: { name: "Terakota", hex: "#b56f52" },
  zaitun: { name: "Zaitun", hex: "#7c8060" },
  batu: { name: "Abu Batu", hex: "#9b9488" },
  tulang: { name: "Putih Tulang", hex: "#ece4d3" },
  sage: { name: "Sage", hex: "#a3ab8e" },
  susu: { name: "Cokelat Susu", hex: "#a98468" },
  arang: { name: "Arang", hex: "#48423b" },
} satisfies Record<string, Color>;

const SIZES = ["S", "M", "L", "XL"];

/** Build a stock map. `soldOut` lists "color|size" keys forced to 0; `all0` zeroes every variant. */
function stockFor(colors: Color[], sizes: string[], seed: number, all0 = false, soldOut: string[] = []) {
  const out: Record<string, number> = {};
  colors.forEach((col, ci) =>
    sizes.forEach((sz, si) => {
      const key = `${col.name}|${sz}`;
      out[key] = all0 || soldOut.includes(key) ? 0 : ((seed + ci * 3 + si * 5) % 9) + 2;
    }),
  );
  return out;
}

type Seed = Omit<Product, "stock" | "sizes"> & {
  sizes?: string[];
  seed: number;
  sold?: boolean;
  out?: string[];
};

const make = ({ seed, sold, out, sizes = SIZES, ...rest }: Seed): Product => ({
  ...rest,
  sizes,
  stock: stockFor(rest.colors, sizes, seed, sold, out),
});

export const products: Product[] = [
  make({
    slug: "gamis-alesha",
    name: "Gamis Alesha",
    category: "Gamis",
    shape: "gamis",
    collection: "senja-di-pesisir",
    price: 389000,
    description:
      "Gamis polos dengan garis bahu jatuh dan kerutan halus di pergelangan. Ada saku samping yang cukup dalam untuk ponsel, dan resleting depan yang ramah untuk ibu menyusui.",
    material: "Ceruty babydoll, furing katun",
    care: "Cuci tangan atau mesin mode lembut, jangan diperas, setrika suhu rendah dari bagian dalam.",
    colors: [c.krem, c.terakota, c.zaitun],
    featured: true,
    isNew: true,
    createdAt: "2026-09-05",
    seed: 3,
  }),
  make({
    slug: "abaya-mahira",
    name: "Abaya Mahira",
    category: "Abaya",
    shape: "abaya",
    collection: "senja-di-pesisir",
    price: 469000,
    description:
      "Abaya terbuka bergaya kimono dengan tali pinggang lepas. Bisa dipakai tertutup sebagai gamis atau terbuka sebagai luaran panjang.",
    material: "Linen rayon, dicuci sebelum dijahit",
    care: "Cuci tangan dengan air dingin. Jemur di tempat teduh.",
    colors: [c.batu, c.krem],
    featured: true,
    isNew: true,
    createdAt: "2026-09-05",
    seed: 5,
  }),
  make({
    slug: "khimar-sena",
    name: "Khimar Sena",
    category: "Khimar",
    shape: "khimar",
    collection: "senja-di-pesisir",
    price: 149000,
    description:
      "Khimar dua lapis sepanjang siku, tidak menerawang dan tidak licin. Bagian dahi memakai jahitan datar sehingga tidak meninggalkan bekas.",
    material: "Ceruty babydoll dua lapis",
    care: "Cuci tangan. Hindari pemutih.",
    colors: [c.terakota, c.zaitun, c.batu, c.krem],
    sizes: ["All Size"],
    bestSeller: true,
    createdAt: "2026-09-05",
    seed: 4,
  }),
  make({
    slug: "set-naira",
    name: "Set Naira",
    category: "Set",
    shape: "set",
    collection: "senja-di-pesisir",
    price: 449000,
    description:
      "Setelan tunik dan rok panjang berpinggang karet. Tunik cukup panjang untuk menutup pinggul; rok jatuh lurus dengan sedikit kerutan di pinggang.",
    material: "Linen rayon",
    care: "Cuci mesin lembut. Setrika saat masih lembap.",
    colors: [c.zaitun, c.krem],
    featured: true,
    createdAt: "2026-08-20",
    seed: 2,
  }),
  make({
    slug: "outer-maura",
    name: "Outer Maura",
    category: "Outer",
    shape: "outer",
    collection: "kebun-pagi",
    price: 259000,
    description:
      "Luaran panjang tanpa kancing dengan potongan lurus. Ringan, cukup untuk menahan angin pagi tanpa membuat gerah.",
    material: "Katun poplin",
    care: "Cuci mesin, suhu maksimal 30 derajat.",
    colors: [c.tulang, c.sage, c.arang],
    bestSeller: true,
    createdAt: "2026-06-12",
    seed: 6,
  }),
  make({
    slug: "gamis-laila",
    name: "Gamis Laila",
    category: "Gamis",
    shape: "gamis",
    collection: "kebun-pagi",
    price: 359000,
    description:
      "Gamis kerah shanghai dengan kancing tersembunyi. Potongan A-line yang tidak menyapu lantai, nyaman untuk berjalan cepat.",
    material: "Crinkle airflow",
    care: "Tidak perlu disetrika. Cuci mesin lembut.",
    colors: [c.sage, c.susu, c.tulang],
    createdAt: "2026-06-12",
    seed: 7,
  }),
  make({
    slug: "set-kirana",
    name: "Set Kirana",
    category: "Set",
    shape: "set",
    collection: "kebun-pagi",
    price: 419000,
    description: "Setelan blus lengan balon dan celana kulot lebar. Cocok untuk kerja maupun acara keluarga.",
    material: "Katun poplin",
    care: "Cuci mesin lembut, setrika suhu sedang.",
    colors: [c.tulang, c.susu],
    featured: true,
    createdAt: "2026-06-12",
    seed: 8,
    out: ["Putih Tulang|XL", "Cokelat Susu|S"],
  }),
  make({
    slug: "khimar-zea",
    name: "Khimar Zea",
    category: "Khimar",
    shape: "khimar",
    collection: "kebun-pagi",
    price: 139000,
    description: "Khimar instan satu lapis dengan bagian dalam bergaris karet halus. Praktis untuk dipakai sehari-hari.",
    material: "Crinkle airflow",
    care: "Cuci tangan. Jemur tanpa diperas kuat.",
    colors: [c.sage, c.susu, c.arang],
    sizes: ["All Size"],
    createdAt: "2026-06-12",
    seed: 3,
    sold: true,
  }),
  make({
    slug: "abaya-sabrina",
    name: "Abaya Sabrina",
    category: "Abaya",
    shape: "abaya",
    collection: "kebun-pagi",
    price: 499000,
    description: "Abaya potongan lurus dengan lengan lebar dan kerah tegak. Furing hanya di bagian dada agar tetap adem.",
    material: "Katun poplin premium",
    care: "Cuci tangan. Setrika suhu sedang.",
    colors: [c.arang, c.tulang],
    createdAt: "2026-05-30",
    seed: 4,
  }),
  make({
    slug: "outer-hanna",
    name: "Outer Hanna",
    category: "Outer",
    shape: "outer",
    collection: "senja-di-pesisir",
    price: 289000,
    description:
      "Luaran linen sepanjang betis dengan dua saku tempel. Dipakai terbuka di atas gamis atau tertutup dengan tali.",
    material: "Linen rayon",
    care: "Cuci tangan atau mesin lembut.",
    colors: [c.krem, c.terakota, c.batu],
    isNew: true,
    createdAt: "2026-09-05",
    seed: 5,
  }),
  make({
    slug: "gamis-inara",
    name: "Gamis Inara",
    category: "Gamis",
    shape: "gamis",
    collection: "kebun-pagi",
    price: 379000,
    description: "Gamis dengan pipping tipis di leher dan manset. Potongan lurus, ringan, dan tidak mudah kusut.",
    material: "Crinkle airflow",
    care: "Cuci mesin lembut, tidak perlu disetrika.",
    colors: [c.zaitun, c.arang],
    createdAt: "2026-05-30",
    seed: 9,
  }),
  make({
    slug: "set-dhia",
    name: "Set Dhia",
    category: "Set",
    shape: "set",
    collection: "senja-di-pesisir",
    price: 429000,
    description:
      "Setelan kemeja panjang dan rok plisket. Detail kancing tersembunyi, cocok untuk hari-hari yang butuh tampil rapi.",
    material: "Ceruty babydoll",
    care: "Cuci tangan, jangan diperas.",
    colors: [c.terakota, c.batu],
    createdAt: "2026-08-20",
    seed: 1,
  }),
];

export const CATEGORIES = ["Gamis", "Abaya", "Khimar", "Set", "Outer"] as const;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const variantStock = (p: Product, color: string, size: string) => p.stock[`${color}|${size}`] ?? 0;

export const totalStock = (p: Product) => Object.values(p.stock).reduce((a, b) => a + b, 0);

/** PRD FR-KAT-5: Sold Out is derived from stock, never stored. */
export const isSoldOut = (p: Product) => totalStock(p) === 0;

export const allColors = (): Color[] => {
  const seen = new Map<string, Color>();
  products.forEach((p) => p.colors.forEach((col) => seen.set(col.name, col)));
  return [...seen.values()];
};
