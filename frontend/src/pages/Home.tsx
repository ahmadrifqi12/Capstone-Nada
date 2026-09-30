import { Link } from "react-router-dom";
import Garment from "../components/Garment";
import { IconArrow } from "../components/Icons";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { latestCollection } from "../data/collections";
import { products } from "../data/products";

const values = [
  { title: "Bahan yang sudah dicuci", body: "Setiap kain dicuci sebelum dipotong, jadi ukurannya tidak berubah setelah pemakaian pertama." },
  { title: "Produksi kecil", body: "Kami menjahit dalam batch kecil bersama penjahit di Bandung. Sedikit sisa, sedikit tekanan." },
  { title: "Potongan untuk bergerak", body: "Lengan, panjang, dan bukaan dirancang untuk wudu, sujud, dan hari yang panjang." },
];

export default function Home() {
  const latest = latestCollection();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const story = products.filter((p) => p.collection === latest.slug).slice(0, 3);
  const hero = products.find((p) => p.slug === "abaya-mahira") ?? products[0];

  return (
    <>
      <Meta title="NADA" description="Busana muslimah dengan potongan tenang, bahan jatuh, dan cerita di balik setiap koleksi." />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-stretch gap-0 md:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow rise">{latest.name} · Koleksi terbaru</p>
          <h1 className="rise mt-6 font-serif text-[2.75rem] font-light leading-[1.05] tracking-tight md:text-7xl" style={{ animationDelay: "80ms" }}>
            Tenang dipakai,
            <br />
            <em className="text-clay">panjang</em> dikenang.
          </h1>
          <p className="rise mt-7 max-w-md text-[15px] leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
            {latest.tagline} Dibuat dalam jumlah kecil, dengan bahan yang jatuh dan potongan yang memberi ruang untuk bergerak.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Link to={`/koleksi/${latest.slug}`} className="btn btn-solid">
              Baca ceritanya
            </Link>
            <Link to="/katalog" className="btn btn-line">
              Belanja
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] md:min-h-[640px]">
          <div className="absolute inset-0">
            <Garment fit="meet" shape={hero.shape} color={latest.tone} label={`${hero.name} dari koleksi ${latest.name}`} />
          </div>
          <Link
            to={`/produk/${hero.slug}`}
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-paper/92 px-5 py-4 backdrop-blur transition hover:bg-paper md:left-auto md:w-72"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">Di foto</span>
              <span className="font-serif text-lg">{hero.name}</span>
            </span>
            <IconArrow />
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Pilihan kami</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Koleksi unggulan</h2>
          </div>
          <Link to="/katalog" className="link-u hidden pb-1 text-[11px] uppercase tracking-[0.2em] sm:block">
            Lihat semua
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* A Closer Look At */}
      <section className="mt-28 bg-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-8 md:py-28">
          <div className="self-center">
            <p className="eyebrow">A Closer Look At</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-5xl">{latest.name}</h2>
            <p className="mt-6 max-w-md font-serif text-xl italic leading-relaxed text-ink/80">“{latest.storyTitle}”</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">{latest.story[0].body}</p>
            <Link to={`/koleksi/${latest.slug}`} className="btn btn-line mt-10">
              Baca cerita lengkap
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {story.map((p, i) => (
              <Link
                key={p.slug}
                to={`/produk/${p.slug}`}
                className={`group block ${i === 1 ? "mt-10 md:mt-16" : ""}`}
              >
                <div className="aspect-[3/5] overflow-hidden">
                  <div className="h-full transition duration-700 group-hover:scale-105">
                    <Garment shape={p.shape} color={p.colors[0].hex} label={p.name} />
                  </div>
                </div>
                <p className="mt-3 font-serif text-base leading-tight md:text-lg">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-7xl px-5 pt-28 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div>
            <p className="eyebrow">Cerita kami</p>
            <h2 className="mt-4 font-serif text-3xl font-light leading-tight md:text-5xl">
              Nada itu nada: sesuatu yang selaras.
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted md:pt-9">
            <p>
              NADA berawal dari kebiasaan sederhana — mencari busana yang enak dipakai dari subuh sampai isya, dan tidak
              membuat kita merasa harus memilih antara nyaman dan rapi.
            </p>
            <p>
              Kami percaya pakaian yang baik bukan yang paling ramai, melainkan yang paling sering dipakai. Karena itu
              setiap koleksi kami mulai dari satu cerita, bukan dari tren.
            </p>
            <Link to="/cerita-kami" className="link-u inline-flex items-center gap-2 pt-2 text-[11px] uppercase tracking-[0.2em] text-ink">
              Selengkapnya <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {values.map((v, i) => (
            <div key={v.title} className="px-0 py-10 md:px-10 md:first:pl-0 md:last:pr-0">
              <p className="font-serif text-sm italic text-clay">0{i + 1}</p>
              <h3 className="mt-3 font-serif text-2xl">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
