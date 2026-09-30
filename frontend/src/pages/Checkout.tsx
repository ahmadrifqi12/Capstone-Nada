import { useState } from "react";
import { Link } from "react-router-dom";
import Garment from "../components/Garment";
import Meta from "../components/Meta";
import { getProduct } from "../data/products";
import { formatRupiah } from "../lib/format";
import { cartSubtotal, useCart } from "../stores/cart";

/** Placeholder rates until the Biteship/Mock provider API exists (Phase 6). The server will recompute them at checkout. */
const COURIERS = [
  { code: "jne-reg", name: "JNE Reguler", eta: "2–3 hari", cost: 18000 },
  { code: "jnt-ez", name: "J&T EZ", eta: "2–4 hari", cost: 16000 },
  { code: "sicepat-best", name: "SiCepat BEST", eta: "1–2 hari", cost: 24000 },
];

const FREE_SHIPPING_MIN = 500000;

export default function Checkout() {
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotal(lines);
  const [courier, setCourier] = useState(COURIERS[0].code);
  const [payment, setPayment] = useState<"midtrans" | "manual">("midtrans");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const chosen = COURIERS.find((c) => c.code === courier)!;
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : chosen.cost;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const [k, label] of [["nama", "Nama penerima"], ["telp", "Nomor telepon"], ["alamat", "Alamat lengkap"], ["kecamatan", "Kecamatan"], ["kota", "Kota"], ["pos", "Kode pos"]]) {
      if (!String(f.get(k) ?? "").trim()) next[k] = `${label} wajib diisi`;
    }
    if (f.get("telp") && !/^(\+62|62|0)8\d{7,12}$/.test(String(f.get("telp")).replace(/[\s-]/g, ""))) next.telp = "Format nomor tidak valid";
    if (f.get("pos") && !/^\d{5}$/.test(String(f.get("pos")))) next.pos = "Kode pos 5 digit";
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <Meta title="Checkout" />
        <h1 className="font-serif text-4xl font-light">Belum ada yang dibeli</h1>
        <Link to="/katalog" className="btn btn-solid mt-10">Lihat katalog</Link>
      </div>
    );
  }

  const field = ({ name, label, type = "text", span = false }: { name: string; label: string; type?: string; span?: boolean }) => (
    <div key={name} className={span ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="text-xs text-muted">{label}</label>
      <input id={name} name={name} type={type} className="field" aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} />
      {errors[name] && <p id={`${name}-err`} className="mt-1 text-xs text-clay">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 md:px-8 md:pt-16">
      <Meta title="Checkout" />
      <h1 className="font-serif text-4xl font-light md:text-5xl">Checkout</h1>

      <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-20">
        <div className="space-y-14">
          <section aria-labelledby="alamat">
            <h2 id="alamat" className="font-serif text-2xl"><span className="mr-3 text-clay">1</span>Alamat pengiriman</h2>
            <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {field({ name: "nama", label: "Nama penerima" })}
              {field({ name: "telp", label: "Nomor telepon", type: "tel" })}
              {field({ name: "alamat", label: "Alamat lengkap", span: true })}
              {field({ name: "kecamatan", label: "Kecamatan" })}
              {field({ name: "kota", label: "Kota / kabupaten" })}
              {field({ name: "pos", label: "Kode pos" })}
            </div>
          </section>

          <section aria-labelledby="kurir">
            <h2 id="kurir" className="font-serif text-2xl"><span className="mr-3 text-clay">2</span>Kurir &amp; ongkos kirim</h2>
            <div className="mt-6 divide-y divide-line border-y border-line" role="radiogroup" aria-labelledby="kurir">
              {COURIERS.map((c) => (
                <label key={c.code} className="flex cursor-pointer items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-4">
                    <input type="radio" name="kurir" value={c.code} checked={courier === c.code} onChange={() => setCourier(c.code)} className="accent-[var(--color-clay)]" />
                    <span>
                      <span className="block text-[15px]">{c.name}</span>
                      <span className="block text-xs text-muted">Estimasi {c.eta}</span>
                    </span>
                  </span>
                  <span className="text-sm">{subtotal >= FREE_SHIPPING_MIN ? <span className="text-olive">Gratis</span> : formatRupiah(c.cost)}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Tarif contoh. Tarif final dihitung ulang oleh server saat pesanan dibuat.</p>
          </section>

          <section aria-labelledby="bayar">
            <h2 id="bayar" className="font-serif text-2xl"><span className="mr-3 text-clay">3</span>Pembayaran</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {([
                ["midtrans", "QRIS, Virtual Account, e-wallet", "Dibayar lewat pop-up Midtrans"],
                ["manual", "Transfer manual", "Unggah bukti, diverifikasi admin"],
              ] as const).map(([v, t, d]) => (
                <label key={v} className={`cursor-pointer border p-5 transition ${payment === v ? "border-ink bg-cream" : "border-line hover:border-ink/50"}`}>
                  <input type="radio" name="bayar" value={v} checked={payment === v} onChange={() => setPayment(v)} className="sr-only" />
                  <span className="block text-[15px]">{t}</span>
                  <span className="mt-1 block text-xs text-muted">{d}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit bg-cream p-7 lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl">Pesananmu</h2>
          <ul className="mt-5 divide-y divide-line">
            {lines.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              const col = p.colors.find((c) => c.name === l.color) ?? p.colors[0];
              return (
                <li key={`${l.slug}${l.color}${l.size}`} className="flex gap-4 py-4">
                  <div className="h-16 w-12 shrink-0 overflow-hidden"><Garment shape={p.shape} color={col.hex} /></div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-base leading-snug">{p.name}</p>
                    <p className="text-xs text-muted">{l.color} · {l.size} · ×{l.qty}</p>
                  </div>
                  <p className="text-sm">{formatRupiah(p.price * l.qty)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatRupiah(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Ongkos kirim</dt><dd>{shipping === 0 ? "Gratis" : formatRupiah(shipping)}</dd></div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="text-sm">Total</span>
            <span className="font-serif text-2xl">{formatRupiah(subtotal + shipping)}</span>
          </div>
          <button type="submit" className="btn btn-solid mt-7 w-full py-4">Buat pesanan</button>
          <p role="status" className="mt-4 text-xs leading-relaxed text-clay">
            {submitted
              ? "Data alamat sudah valid. Pembuatan pesanan dan pembayaran akan aktif setelah backend tersambung."
              : Object.keys(errors).length > 0
                ? "Lengkapi data yang ditandai terlebih dahulu."
                : ""}
          </p>
        </aside>
      </form>
    </div>
  );
}
