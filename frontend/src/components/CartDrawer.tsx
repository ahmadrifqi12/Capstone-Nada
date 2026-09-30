import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getProduct } from "../data/products";
import { formatRupiah } from "../lib/format";
import { cartCount, cartSubtotal, lineKey, useCart } from "../stores/cart";
import Garment from "./Garment";
import { IconClose, IconMinus, IconPlus } from "./Icons";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-2xl">Keranjang <span className="text-base text-muted">({cartCount(lines)})</span></h2>
          <button type="button" aria-label="Tutup keranjang" className="p-1" onClick={() => setOpen(false)}>
            <IconClose />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-2xl">Keranjangmu masih kosong</p>
            <p className="mt-2 text-sm text-muted">Mulai dari koleksi terbaru kami.</p>
            <Link to="/katalog" onClick={() => setOpen(false)} className="btn btn-solid mt-8">
              Lihat katalog
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                const col = p.colors.find((c) => c.name === l.color) ?? p.colors[0];
                const key = lineKey(l);
                return (
                  <li key={key} className="flex gap-4 py-5">
                    <Link to={`/produk/${p.slug}`} onClick={() => setOpen(false)} className="block h-28 w-20 shrink-0 overflow-hidden">
                      <Garment shape={p.shape} color={col.hex} label={p.name} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg leading-snug">{p.name}</p>
                          <p className="text-xs text-muted">{l.color} · {l.size}</p>
                        </div>
                        <p className="text-sm">{formatRupiah(p.price * l.qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button type="button" aria-label="Kurangi" className="p-2" onClick={() => setQty(key, l.qty - 1)}>
                            <IconMinus />
                          </button>
                          <span className="w-7 text-center text-sm" aria-live="polite">{l.qty}</span>
                          <button type="button" aria-label="Tambah" className="p-2" onClick={() => setQty(key, l.qty + 1)}>
                            <IconPlus />
                          </button>
                        </div>
                        <button type="button" className="link-u text-xs text-muted hover:text-ink" onClick={() => remove(key)}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-serif text-2xl">{formatRupiah(cartSubtotal(lines))}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Ongkos kirim dihitung saat checkout.</p>
              <div className="mt-5 grid gap-3">
                <Link to="/checkout" onClick={() => setOpen(false)} className="btn btn-solid">
                  Checkout
                </Link>
                <Link to="/keranjang" onClick={() => setOpen(false)} className="btn btn-line">
                  Lihat keranjang
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
