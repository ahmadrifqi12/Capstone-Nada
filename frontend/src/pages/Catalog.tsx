import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IconClose } from "../components/Icons";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { collections } from "../data/collections";
import { allColors, CATEGORIES, isSoldOut, products } from "../data/products";
import { formatRupiah } from "../lib/format";

const SORTS = [
  { v: "terbaru", label: "Terbaru" },
  { v: "harga-asc", label: "Harga terendah" },
  { v: "harga-desc", label: "Harga tertinggi" },
] as const;

const PRICES = [
  { v: "", label: "Semua harga" },
  { v: "0-200000", label: "Di bawah Rp 200.000" },
  { v: "200000-400000", label: "Rp 200.000 – 400.000" },
  { v: "400000-", label: "Di atas Rp 400.000" },
];

/** Cheap typo tolerance: every query token must match a word, allowing one edit for tokens of 4+ chars. */
const near = (a: string, b: string) => {
  if (b.includes(a)) return true;
  if (a.length < 4) return false;
  for (const w of b.split(/\s+/)) {
    if (Math.abs(w.length - a.length) > 1) continue;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < w.length) {
      if (a[i] === w[j]) { i++; j++; continue; }
      if (++edits > 1) break;
      if (a.length > w.length) i++;
      else if (a.length < w.length) j++;
      else { i++; j++; }
    }
    if (edits + (a.length - i) + (w.length - j) <= 1) return true;
  }
  return false;
};

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const q = params.get("q") ?? "";
  const kategori = params.get("kategori") ?? "";
  const koleksi = params.get("koleksi") ?? "";
  const warna = params.get("warna") ?? "";
  const ukuran = params.get("ukuran") ?? "";
  const harga = params.get("harga") ?? "";
  const sort = params.get("urut") ?? "terbaru";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const [lo, hi] = harga ? harga.split("-").map((n) => (n ? Number(n) : null)) : [null, null];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const out = products.filter((p) => {
      if (kategori && p.category !== kategori) return false;
      if (koleksi && p.collection !== koleksi) return false;
      if (warna && !p.colors.some((c) => c.name === warna)) return false;
      if (ukuran && !p.sizes.includes(ukuran)) return false;
      if (lo !== null && p.price < lo) return false;
      if (hi !== null && p.price >= hi) return false;
      if (tokens.length) {
        const hay = `${p.name} ${p.category} ${p.description} ${p.material}`.toLowerCase();
        if (!tokens.every((t) => near(t, hay))) return false;
      }
      return true;
    });
    return out.sort((a, b) =>
      sort === "harga-asc" ? a.price - b.price : sort === "harga-desc" ? b.price - a.price : b.createdAt.localeCompare(a.createdAt),
    );
  }, [q, kategori, koleksi, warna, ukuran, harga, sort]);

  const active = [kategori, koleksi, warna, ukuran, harga].filter(Boolean).length;
  const sizes = ["S", "M", "L", "XL", "All Size"];

  const filters = (
    <div className="space-y-9">
      <fieldset>
        <legend className="eyebrow mb-4">Kategori</legend>
        <ul className="space-y-2.5 text-sm">
          {["", ...CATEGORIES].map((c) => (
            <li key={c}>
              <button type="button" onClick={() => set("kategori", c)} className={`link-u ${kategori === c ? "text-ink" : "text-muted hover:text-ink"}`} aria-pressed={kategori === c}>
                {c || "Semua"}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-4">Koleksi</legend>
        <ul className="space-y-2.5 text-sm">
          <li>
            <button type="button" onClick={() => set("koleksi", "")} className={`link-u ${!koleksi ? "text-ink" : "text-muted hover:text-ink"}`}>Semua</button>
          </li>
          {collections.map((c) => (
            <li key={c.slug}>
              <button type="button" onClick={() => set("koleksi", c.slug)} className={`link-u ${koleksi === c.slug ? "text-ink" : "text-muted hover:text-ink"}`} aria-pressed={koleksi === c.slug}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-4">Warna</legend>
        <div className="flex flex-wrap gap-2.5">
          {allColors().map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={warna === c.name}
              onClick={() => set("warna", warna === c.name ? "" : c.name)}
              className={`h-7 w-7 rounded-full border transition ${warna === c.name ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink/15"}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-4">Ukuran</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={ukuran === s}
              onClick={() => set("ukuran", ukuran === s ? "" : s)}
              className={`border px-3 py-1.5 text-xs transition ${ukuran === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-4">Harga</legend>
        <ul className="space-y-2.5 text-sm">
          {PRICES.map((p) => (
            <li key={p.v}>
              <button type="button" onClick={() => set("harga", p.v)} className={`link-u ${harga === p.v ? "text-ink" : "text-muted hover:text-ink"}`} aria-pressed={harga === p.v}>
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      {(active > 0 || q) && (
        <button type="button" onClick={() => setParams({}, { replace: true })} className="link-u text-xs text-clay">
          Hapus semua filter
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-8 md:pt-16">
      <Meta title="Katalog" description="Jelajahi gamis, abaya, khimar, set, dan outer NADA." />
      <header className="max-w-2xl">
        <p className="eyebrow">Katalog</p>
        <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">
          {q ? <>Hasil untuk “{q}”</> : kategori || "Semua produk"}
        </h1>
      </header>

      <div className="mt-10 flex items-center justify-between border-y border-line py-3">
        <button type="button" className="text-[11px] uppercase tracking-[0.2em] md:hidden" onClick={() => setDrawer(true)}>
          Filter{active ? ` (${active})` : ""}
        </button>
        <p className="hidden text-sm text-muted md:block" aria-live="polite">{list.length} produk</p>
        <label className="flex items-center gap-3 text-sm">
          <span className="text-muted">Urutkan</span>
          <select value={sort} onChange={(e) => set("urut", e.target.value === "terbaru" ? "" : e.target.value)} className="cursor-pointer bg-transparent py-1 pr-1 outline-none">
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-[13rem_1fr] lg:gap-16">
        <aside className="hidden md:block" aria-label="Filter">{filters}</aside>

        <section aria-label="Daftar produk">
          {list.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl">Belum ada yang cocok</p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted">Coba kata kunci lain atau kurangi filter yang aktif.</p>
              <button type="button" className="btn btn-line mt-8" onClick={() => setParams({}, { replace: true })}>
                Hapus filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
              {[...list.filter((p) => !isSoldOut(p)), ...list.filter(isSoldOut)].map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
          {list.length > 0 && (
            <p className="mt-14 text-center text-xs text-muted">
              Rentang harga {formatRupiah(Math.min(...list.map((p) => p.price)))} – {formatRupiah(Math.max(...list.map((p) => p.price)))}
            </p>
          )}
        </section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filter">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-serif text-2xl">Filter</h2>
              <button type="button" aria-label="Tutup" onClick={() => setDrawer(false)} className="p-1"><IconClose /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
            <div className="border-t border-line p-5">
              <button type="button" className="btn btn-solid w-full" onClick={() => setDrawer(false)}>
                Lihat {list.length} produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
