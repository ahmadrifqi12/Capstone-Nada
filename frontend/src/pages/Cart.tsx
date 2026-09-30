import { Link } from "react-router-dom";
import Garment from "../components/Garment";
import { IconMinus, IconPlus } from "../components/Icons";
import Meta from "../components/Meta";
import { getProduct, variantStock } from "../data/products";
import { formatRupiah } from "../lib/format";
import { cartSubtotal, lineKey, useCart } from "../stores/cart";

export default function Cart() {
  const { lines, setQty, remove } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 md:px-8 md:pt-16">
      <Meta title="Keranjang" />
      <h1 className="font-serif text-4xl font-light md:text-5xl">Keranjang</h1>

      {lines.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl">Keranjangmu masih kosong</p>
          <p className="mt-3 text-sm text-muted">Temukan sesuatu yang terasa pas di katalog kami.</p>
          <Link to="/katalog" className="btn btn-solid mt-8">Lihat katalog</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              const col = p.colors.find((c) => c.name === l.color) ?? p.colors[0];
              const key = lineKey(l);
              const left = variantStock(p, l.color, l.size);
              return (
                <li key={key} className="flex gap-5 py-6">
                  <Link to={`/produk/${p.slug}`} className="block h-36 w-28 shrink-0 overflow-hidden">
                    <Garment shape={p.shape} color={col.hex} label={p.name} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link to={`/produk/${p.slug}`} className="font-serif text-xl">{p.name}</Link>
                        <p className="mt-1 text-sm text-muted">{l.color} · {l.size}</p>
                        <p className="mt-1 text-sm text-muted">{formatRupiah(p.price)}</p>
                      </div>
                      <p className="text-[15px]">{formatRupiah(p.price * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-line">
                        <button type="button" aria-label="Kurangi" className="p-2.5" onClick={() => setQty(key, l.qty - 1)}><IconMinus /></button>
                        <span className="w-9 text-center text-sm">{l.qty}</span>
                        <button type="button" aria-label="Tambah" className="p-2.5 disabled:opacity-30" disabled={l.qty >= left} onClick={() => setQty(key, l.qty + 1)}><IconPlus /></button>
                      </div>
                      <button type="button" className="link-u text-sm text-muted hover:text-ink" onClick={() => remove(key)}>Hapus</button>
                    </div>
                    {l.qty >= left && <p className="mt-2 text-xs text-clay">Jumlah maksimum sesuai stok tersedia.</p>}
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit bg-cream p-7 lg:sticky lg:top-32">
            <h2 className="font-serif text-2xl">Ringkasan</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatRupiah(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Ongkos kirim</dt><dd className="text-muted">Dihitung di checkout</dd></div>
            </dl>
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-sm">Total sementara</span>
              <span className="font-serif text-2xl">{formatRupiah(subtotal)}</span>
            </div>
            <Link to="/checkout" className="btn btn-solid mt-7 w-full py-4">Lanjut ke checkout</Link>
            <Link to="/katalog" className="link-u mt-5 block text-center text-xs text-muted hover:text-ink">Lanjut belanja</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
