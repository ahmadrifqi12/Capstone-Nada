import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

function LandingPage() {
  const navItems = [
    "26°RHAPSODY",
    "SUMMER MARCHÉ VOL. 2",
    "LOOKBOOK",
    "SHOP",
    "CONCIERGE",
    "TAZA WORLD",
    "MEDIA ROOM",
    "OUTLET",
  ];

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#2b2620]">
      <header className="sticky top-0 z-20 border-b border-[#ddd2bd] bg-[#f7f2ea]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="w-16" />
          <button
            type="button"
            aria-label="NADA home"
            className="font-serif text-2xl tracking-wide"
          >
            nada.
          </button>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              aria-label="Open login and register page"
              className="p-1.5 opacity-80 transition hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path d="M12 12.2c2.3 0 4.2-1.9 4.2-4.2S14.3 3.8 12 3.8 7.8 5.7 7.8 8s1.9 4.2 4.2 4.2Zm0 2.1c-3.6 0-6.8 2.1-8.2 5.2-.2.4.1.8.5.8h15.4c.4 0 .7-.4.5-.8-1.4-3.1-4.6-5.2-8.2-5.2Z" />
              </svg>
            </Link>
            <button
              type="button"
              aria-label="Search"
              className="p-1.5 opacity-80 transition hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path d="m20.3 19-4.6-4.6c1-1.2 1.5-2.7 1.5-4.3 0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7c1.6 0 3.1-.5 4.3-1.5l4.6 4.6 1.2-1.2ZM5 10.1C5 7.2 7.3 4.9 10.2 4.9s5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2S5 13 5 10.1Z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Bag"
              className="p-1.5 opacity-80 transition hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path d="M7 8.2V7c0-2.8 2.2-5 5-5s5 2.2 5 5v1.2h2.1l1 13.8H3.9l1-13.8H7Zm1.8 0h6.4V7c0-1.8-1.4-3.2-3.2-3.2S8.8 5.2 8.8 7v1.2Zm-2.2 1.7-.7 10.3h12.2l-.7-10.3H6.6Z" />
              </svg>
            </button>
          </div>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#ddd2bd] px-6 py-3 text-[11px] tracking-widest uppercase"
        >
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="opacity-70 transition hover:opacity-100"
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <section aria-label="Hero section" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-3 text-xs tracking-[0.25em] text-[#8a5f45] uppercase">
            SUMMER ☼ MARCHÉ <span className="font-semibold">VOL. 2</span>
          </p>
          <h1 className="mx-auto mb-6 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Anggun dalam Setiap Langkah
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed opacity-70">
            Busana muslimah dengan potongan modern dan bahan premium, dirancang
            untuk perempuan yang bergerak dengan percaya diri.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="bg-[#2b2620] px-7 py-3 text-xs tracking-widest text-[#f7f2ea] uppercase transition hover:bg-[#8a5f45]"
            >
              Shop The Collection
            </button>
            <button
              type="button"
              className="border border-[#2b2620] px-7 py-3 text-xs tracking-widest uppercase transition hover:bg-[#2b2620] hover:text-[#f7f2ea]"
            >
              Lookbook
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="mb-8 text-center font-serif text-2xl">
            Koleksi Pilihan
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                name: "Gamis Alesha",
                by: "Koleksi Signature",
                price: "Rp 389.000",
              },
              {
                name: "Outer Maura",
                by: "Koleksi Signature",
                price: "Rp 259.000",
              },
              {
                name: "Set Naira",
                by: "Koleksi Signature",
                price: "Rp 449.000",
              },
              {
                name: "Khimar Sena",
                by: "Koleksi Signature",
                price: "Rp 129.000",
              },
            ].map((item) => (
              <div key={item.name} className="group text-left">
                <div className="mb-3 aspect-[3/4] bg-gradient-to-br from-[#e4d6c0] to-[#cdb392]" />
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs opacity-60">{item.by}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-[#8a5f45]">{item.price}</span>
                  <button
                    type="button"
                    className="text-[11px] tracking-widest uppercase opacity-70 transition group-hover:opacity-100"
                  >
                    Lihat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="border border-[#ddd2bd] bg-[#eee4d4] px-6 py-5 text-sm">
            <p className="mb-1 font-medium">Barnyard</p>
            <span className="block opacity-70">
              Jl. Kemang Selatan II No. 6, Jakarta Selatan
            </span>
            <strong className="mt-1 block">
              17 - 20 September 2026 | 09.00 - 20.00
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
