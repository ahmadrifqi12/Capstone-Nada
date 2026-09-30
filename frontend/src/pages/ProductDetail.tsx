import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Garment from "../components/Garment";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { getCollection } from "../data/collections";
import { getProduct, isSoldOut, products, variantStock } from "../data/products";
import { formatRupiah } from "../lib/format";
import { useCart } from "../stores/cart";
import NotFound from "./NotFound";

const SIZE_CHART = [
  { size: "S", dada: 96, panjang: 135 },
  { size: "M", dada: 100, panjang: 137 },
  { size: "L", dada: 106, panjang: 139 },
  { size: "XL", dada: 112, panjang: 141 },
];

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  if (!product) return <NotFound />;
  return <Detail key={product.slug} slug={product.slug} />;
}

function Detail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [note, setNote] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);
  const [chart, setChart] = useState(false);
  const [view, setView] = useState(0);

  const col = product.colors.find((c) => c.name === color)!;
  const collection = getCollection(product.collection);
  const soldOut = isSoldOut(product);
  const stock = size ? variantStock(product, color, size) : null;
  const related = products.filter((p) => p.slug !== product.slug && (p.category === product.category || p.collection === product.collection)).slice(0, 4);
  const hasChart = product.category !== "Khimar";

  const tint = (pct: number) => `color-mix(in srgb, ${col.hex} ${pct}%, ${pct > 50 ? "#2b2620" : "#f6f1e8"})`;
  const views: { label: string; shift: string }[] = [
    { label: "Depan", shift: "none" },
    { label: "Detail", shift: "scale(1.9) translate(0,12%)" },
    { label: "Bahan", shift: "scale(3) translate(0,2%)" },
  ];

  const onAdd = () => {
    if (!size) return setNote({ tone: "warn", text: "Pilih ukuran terlebih dahulu." });
    const res = add({ slug: product.slug, color, size });
    if (res === "empty") return setNote({ tone: "warn", text: "Varian ini sedang habis." });
    setNote(res === "capped" ? { tone: "warn", text: "Jumlah di keranjang disesuaikan dengan stok yang tersedia." } : { tone: "ok", text: "Ditambahkan ke keranjang." });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-6 pt-8 md:px-8">
      <Meta title={product.name} description={`${product.name} — ${product.description}`} />
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link to="/katalog" className="hover:text-ink">Katalog</Link> <span aria-hidden>/</span>{" "}
        <Link to={`/katalog?kategori=${product.category}`} className="hover:text-ink">{product.category}</Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        {/* Gallery */}
        <div className="grid gap-3 md:grid-cols-[4.5rem_1fr]">
          <div className="order-2 flex gap-3 md:order-1 md:flex-col" role="tablist" aria-label="Sudut foto">
            {views.map((v, i) => (
              <button
                key={v.label}
                type="button"
                role="tab"
                aria-selected={view === i}
                aria-label={v.label}
                onClick={() => setView(i)}
                className={`aspect-[3/4] w-16 overflow-hidden border md:w-full ${view === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <div className="h-full w-full overflow-hidden">
                  <div className="h-full w-full" style={{ transform: v.shift, transformOrigin: "50% 30%" }}>
                    <Garment shape={product.shape} color={col.hex} />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="order-1 aspect-[3/4] overflow-hidden bg-cream md:order-2">
            <div className="h-full w-full transition-transform duration-700 ease-out" style={{ transform: views[view].shift, transformOrigin: "50% 30%" }}>
              <Garment shape={product.shape} color={col.hex} label={`${product.name}, warna ${col.name}`} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="md:sticky md:top-32 md:self-start">
          {collection && (
            <Link to={`/koleksi/${collection.slug}`} className="eyebrow link-u">
              {collection.name}
            </Link>
          )}
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl text-clay">{formatRupiah(product.price)}</p>

          <p className="mt-6 text-[15px] leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <p className="text-sm">
              Warna <span className="text-muted">— {col.name}</span>
            </p>
            <div className="mt-3 flex gap-3" role="radiogroup" aria-label="Warna">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={c.name === color}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => { setColor(c.name); setNote(null); }}
                  className={`h-9 w-9 rounded-full border transition ${c.name === color ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink/15 hover:scale-105"}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-sm">Ukuran</p>
              {hasChart && (
                <button type="button" className="link-u text-xs text-muted hover:text-ink" onClick={() => setChart(true)}>
                  Panduan ukuran
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Ukuran">
              {product.sizes.map((s) => {
                const left = variantStock(product, color, s);
                const out = left === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    aria-disabled={out}
                    disabled={out}
                    onClick={() => { setSize(s); setNote(null); }}
                    className={`relative min-w-14 border px-4 py-2.5 text-sm transition ${
                      size === s ? "border-ink bg-ink text-paper" : out ? "border-line text-muted/60" : "border-line hover:border-ink"
                    }`}
                  >
                    {s}
                    {out && <span aria-hidden className="absolute inset-0 overflow-hidden"><span className="absolute left-0 top-1/2 h-px w-full -rotate-[24deg] bg-muted/50" /></span>}
                  </button>
                );
              })}
            </div>
            {stock !== null && stock > 0 && stock <= 3 && <p className="mt-3 text-xs text-clay">Tersisa {stock} pcs</p>}
          </div>

          <button type="button" onClick={onAdd} disabled={soldOut} className="btn btn-solid mt-9 w-full py-4">
            {soldOut ? "Stok habis" : "Tambah ke keranjang"}
          </button>
          <p role="status" className={`mt-3 min-h-5 text-sm ${note?.tone === "warn" ? "text-clay" : "text-olive"}`}>{note?.text}</p>

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between">Bahan <span className="text-muted transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 leading-relaxed text-muted">{product.material}</p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between">Perawatan <span className="text-muted transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 leading-relaxed text-muted">{product.care}</p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between">Pengiriman &amp; penukaran <span className="text-muted transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 leading-relaxed text-muted">
                Dikirim dari Bandung dalam 1–2 hari kerja. Penukaran ukuran mengikuti <Link to="/faq#penukaran" className="underline">kebijakan kami</Link>.
              </p>
            </details>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="font-serif text-3xl">Mungkin kamu suka</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}

      {chart && (
        <div className="fixed inset-0 z-50 grid place-items-center p-5" role="dialog" aria-modal="true" aria-label="Panduan ukuran">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setChart(false)} />
          <div className="relative w-full max-w-md bg-paper p-8" style={{ boxShadow: `0 30px 80px -30px ${tint(60)}` }}>
            <h2 className="font-serif text-2xl">Panduan ukuran</h2>
            <p className="mt-1 text-xs text-muted">Ukuran dalam cm. Toleransi ±1–2 cm.</p>
            <table className="mt-6 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted">
                <tr><th className="pb-3 font-normal">Ukuran</th><th className="pb-3 font-normal">Lingkar dada</th><th className="pb-3 font-normal">Panjang</th></tr>
              </thead>
              <tbody className="divide-y divide-line border-t border-line">
                {SIZE_CHART.map((r) => (
                  <tr key={r.size}><td className="py-3">{r.size}</td><td>{r.dada}</td><td>{r.panjang}</td></tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-line mt-8 w-full" onClick={() => setChart(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
