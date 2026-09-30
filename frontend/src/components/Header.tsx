import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cartCount, useCart } from "../stores/cart";
import { IconBag, IconClose, IconMenu, IconSearch, IconUser } from "./Icons";

const NAV = [
  { to: "/koleksi", label: "Koleksi" },
  { to: "/katalog", label: "Katalog" },
  { to: "/cerita-kami", label: "Cerita Kami" },
  { to: "/faq", label: "FAQ" },
];

export default function Header() {
  const count = useCart((s) => cartCount(s.lines));
  const setOpen = useCart((s) => s.setOpen);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/katalog${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
    setQ("");
  };

  const link = ({ isActive }: { isActive: boolean }) =>
    `link-u py-1 text-[11px] uppercase tracking-[0.2em] ${isActive ? "text-ink" : "text-ink/65 hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="bg-ink px-4 py-2 text-center text-[11px] tracking-[0.14em] text-paper/90">
        Gratis ongkir untuk pembelian di atas Rp 500.000
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 py-4 md:px-8">
        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={link}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="-ml-2 p-2 md:hidden justify-self-start"
          aria-label="Buka menu"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
        >
          <IconMenu />
        </button>

        <Link to="/" aria-label="NADA — beranda" className="font-serif text-[2rem] italic leading-none tracking-tight">
          nada
        </Link>

        <div className="flex items-center justify-end gap-1">
          <button type="button" aria-label="Cari produk" className="p-2 opacity-80 hover:opacity-100" onClick={() => setSearch((v) => !v)}>
            <IconSearch />
          </button>
          <Link to="/akun" aria-label="Akun saya" className="hidden p-2 opacity-80 hover:opacity-100 sm:block">
            <IconUser />
          </Link>
          <button type="button" aria-label={`Keranjang, ${count} item`} className="relative p-2 opacity-80 hover:opacity-100" onClick={() => setOpen(true)}>
            <IconBag />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] leading-none text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {search && (
        <form onSubmit={submit} className="border-t border-line">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 md:px-8">
            <IconSearch className="shrink-0 text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari gamis, abaya, khimar…"
              aria-label="Kata kunci pencarian"
              className="w-full bg-transparent py-2 text-base outline-none placeholder:text-muted/70"
            />
            <button type="submit" className="text-[11px] uppercase tracking-[0.2em]">Cari</button>
          </div>
        </form>
      )}

      {menu && (
        <div className="fixed inset-0 z-40 bg-paper md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-serif text-[2rem] italic leading-none">nada</span>
            <button type="button" aria-label="Tutup menu" className="p-2" onClick={() => setMenu(false)}>
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-6">
            {[...NAV, { to: "/akun", label: "Akun Saya" }].map((n) => (
              <Link key={n.to} to={n.to} className="border-b border-line py-4 font-serif text-2xl">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
