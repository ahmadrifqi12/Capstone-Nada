import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, variantStock } from "../data/products";

/** Guest cart: only identifiers + quantity are stored. Prices are always read from the catalog (PRD FR-CRT-3). */
export interface CartLine {
  slug: string;
  color: string;
  size: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => "ok" | "capped" | "empty";
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const lineKey = (l: Pick<CartLine, "slug" | "color" | "size">) => `${l.slug}|${l.color}|${l.size}`;

const maxFor = (l: Pick<CartLine, "slug" | "color" | "size">) => {
  const p = getProduct(l.slug);
  return p ? variantStock(p, l.color, l.size) : 0;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      add: (line, qty = 1) => {
        const max = maxFor(line);
        if (max <= 0) return "empty";
        const key = lineKey(line);
        const existing = get().lines.find((l) => lineKey(l) === key);
        const wanted = (existing?.qty ?? 0) + qty;
        const next = Math.min(wanted, max);
        set((s) => ({
          open: true,
          lines: existing
            ? s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: next } : l))
            : [...s.lines, { ...line, qty: next }],
        }));
        return wanted > max ? "capped" : "ok";
      },
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(0, Math.min(qty, maxFor(l))) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "nada-guest-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
