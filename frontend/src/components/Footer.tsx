import { Link } from "react-router-dom";

const cols = [
  {
    title: "Belanja",
    links: [
      { to: "/katalog", label: "Semua produk" },
      { to: "/katalog?kategori=Gamis", label: "Gamis" },
      { to: "/katalog?kategori=Abaya", label: "Abaya" },
      { to: "/katalog?kategori=Khimar", label: "Khimar" },
      { to: "/koleksi", label: "Koleksi" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { to: "/faq", label: "Pengiriman" },
      { to: "/faq#penukaran", label: "Penukaran & pengembalian" },
      { to: "/faq#ukuran", label: "Panduan ukuran" },
      { to: "/akun", label: "Lacak pesanan" },
    ],
  },
  {
    title: "NADA",
    links: [
      { to: "/cerita-kami", label: "Cerita kami" },
      { to: "/koleksi/senja-di-pesisir", label: "A Closer Look At" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <p className="font-serif text-4xl italic leading-none">nada</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Busana muslimah dengan potongan tenang dan bahan yang jatuh. Dibuat dalam jumlah kecil, dijahit di Bandung.
          </p>
          <form className="mt-8 max-w-xs" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nl" className="eyebrow">Kabar koleksi baru</label>
            <div className="mt-2 flex items-end gap-3">
              <input id="nl" type="email" required placeholder="Email kamu" className="field" />
              <button type="submit" className="pb-2 text-[11px] uppercase tracking-[0.2em] hover:text-clay">
                Daftar
              </button>
            </div>
          </form>
        </div>
        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow">{col.title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="link-u text-ink/80 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted md:flex-row md:justify-between md:px-8">
          <p>© 2026 NADA. Proyek capstone.</p>
          <p>Instagram · TikTok · hello@nada.id</p>
        </div>
      </div>
    </footer>
  );
}
