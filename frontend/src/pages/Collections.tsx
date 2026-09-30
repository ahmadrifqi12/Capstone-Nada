import { Link, useParams } from "react-router-dom";
import Garment from "../components/Garment";
import { IconArrow } from "../components/Icons";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { collections, getCollection } from "../data/collections";
import { products } from "../data/products";
import NotFound from "./NotFound";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(iso));

export function CollectionsIndex() {
  const list = [...collections].sort((a, b) => b.launch.localeCompare(a.launch));
  return (
    <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 md:px-8 md:pt-16">
      <Meta title="Koleksi" description="Lookbook koleksi NADA, lengkap dengan cerita di balik setiap peluncuran." />
      <header className="max-w-2xl">
        <p className="eyebrow">Lookbook</p>
        <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">Koleksi</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          Setiap koleksi dimulai dari satu cerita. Baca dulu ceritanya, lalu pilih yang terasa paling dekat.
        </p>
      </header>

      <div className="mt-14 space-y-20 md:space-y-28">
        {list.map((c, i) => {
          const items = products.filter((p) => p.collection === c.slug);
          const lead = items[0];
          return (
            <article key={c.slug} className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <Link to={`/koleksi/${c.slug}`} className="group block aspect-[4/5] overflow-hidden">
                <div className="h-full transition duration-700 group-hover:scale-[1.03]">
                  <Garment fit="meet" shape={lead.shape} color={c.tone} label={`Koleksi ${c.name}`} />
                </div>
              </Link>
              <div>
                <p className="eyebrow">{fmtDate(c.launch)} · {items.length} produk</p>
                <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-5xl">{c.name}</h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">{c.tagline}</p>
                <Link to={`/koleksi/${c.slug}`} className="link-u mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                  Baca ceritanya <IconArrow />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function CollectionStory() {
  const { slug = "" } = useParams();
  const c = getCollection(slug);
  if (!c) return <NotFound />;
  const items = products.filter((p) => p.collection === c.slug);
  const lead = items[0];

  return (
    <article>
      <Meta title={`${c.name} — A Closer Look`} description={c.tagline} />
      <header className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
        <p className="eyebrow">A Closer Look At</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-tight md:text-8xl">{c.name}</h1>
        <p className="mt-6 max-w-xl font-serif text-xl italic text-ink/75">{c.tagline}</p>
      </header>

      <div className="mx-auto mt-12 aspect-[16/11] max-w-7xl overflow-hidden md:px-8 md:aspect-[21/9]">
        <Garment fit="meet" shape={lead.shape} color={c.tone} label={`Suasana koleksi ${c.name}`} />
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-12 px-5 md:grid-cols-[1fr_2fr] md:gap-20 md:px-8">
        <aside className="md:sticky md:top-32 md:self-start">
          <h2 className="font-serif text-3xl leading-snug">{c.storyTitle}</h2>
          <dl className="mt-8 space-y-5 border-t border-line pt-6 text-sm">
            {c.details.map((d) => (
              <div key={d.label}>
                <dt className="eyebrow">{d.label}</dt>
                <dd className="mt-1 text-muted">{d.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="max-w-2xl space-y-10">
          {c.story.map((s, i) => (
            <section key={i}>
              {s.heading && <h3 className="mb-3 font-serif text-2xl">{s.heading}</h3>}
              <p className={`leading-[1.85] text-ink/85 ${i === 0 ? "text-lg first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-clay" : "text-[15px]"}`}>
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>

      <section className="mx-auto mt-28 max-w-7xl px-5 md:px-8" aria-labelledby="shop-story">
        <div className="flex items-end justify-between gap-6 border-t border-line pt-14">
          <div>
            <p className="eyebrow">Shop the Story</p>
            <h2 id="shop-story" className="mt-3 font-serif text-3xl md:text-4xl">Dari koleksi ini</h2>
          </div>
          <Link to={`/katalog?koleksi=${c.slug}`} className="link-u hidden pb-1 text-[11px] uppercase tracking-[0.2em] sm:block">Lihat di katalog</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>
    </article>
  );
}
