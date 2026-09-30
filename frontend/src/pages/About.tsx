import { Link } from "react-router-dom";
import Garment from "../components/Garment";
import Meta from "../components/Meta";

const principles = [
  ["Selaras", "Nada berarti nada. Kami mencari keselarasan antara nyaman, rapi, dan sederhana."],
  ["Secukupnya", "Kami tidak mengejar tren musiman. Koleksi dibuat sedikit dan dibuat ulang hanya bila layak."],
  ["Jujur", "Bahan, asal jahit, dan cara merawat kami tuliskan apa adanya di setiap halaman produk."],
];

export default function About() {
  return (
    <div>
      <Meta title="Cerita Kami" description="Kisah berdirinya NADA, nilai yang kami pegang, dan cara kami membuat busana muslimah." />
      <header className="mx-auto max-w-4xl px-5 pb-6 pt-16 text-center md:pt-24">
        <p className="eyebrow">Cerita kami</p>
        <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
          Pakaian yang <em className="text-clay">menemani</em>, bukan menuntut.
        </h1>
      </header>

      <div className="mx-auto mt-14 grid max-w-7xl gap-3 px-5 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div className="aspect-[4/3] overflow-hidden"><Garment fit="meet" shape="abaya" color="#c9b08f" label="Ilustrasi abaya" /></div>
        <div className="hidden aspect-[3/4] overflow-hidden md:block"><Garment fit="meet" shape="khimar" color="#a3ab8e" label="Ilustrasi khimar" /></div>
      </div>

      <section className="mx-auto mt-24 grid max-w-7xl gap-10 px-5 md:grid-cols-[1fr_1.4fr] md:gap-24 md:px-8">
        <h2 className="font-serif text-3xl leading-snug md:text-4xl">Berawal dari lemari yang penuh, tapi tak ada yang enak dipakai.</h2>
        <div className="space-y-6 text-[15px] leading-[1.85] text-ink/80">
          <p>
            NADA dimulai dari keluhan yang sangat biasa: lemari penuh, tetapi setiap pagi kami mengambil baju yang itu-itu
            juga. Ada yang terlalu panas, ada yang menerawang, ada yang cantik di foto tetapi menyulitkan saat wudu.
          </p>
          <p>
            Kami mulai menggambar sendiri. Satu gamis, satu abaya, satu khimar, dan kami uji selama berminggu-minggu —
            dicuci berulang, dipakai ke kantor, ke pasar, ke masjid. Yang lolos, kami produksi.
          </p>
          <p>
            Sampai hari ini pola itu belum berubah. Setiap koleksi lahir dari satu cerita dan satu pertanyaan:
            apakah ini akan dipakai lagi minggu depan?
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {principles.map(([t, b]) => (
            <div key={t} className="py-10 md:px-10 md:first:pl-0 md:last:pr-0">
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-5 text-center">
        <h2 className="font-serif text-3xl">Ingin bertanya atau sekadar menyapa?</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Kami membalas pesan setiap hari kerja. Tulis ke hello@nada.id atau temui kami di Instagram dan TikTok @nada.id.
        </p>
        <Link to="/koleksi" className="btn btn-line mt-8">Lihat koleksi</Link>
      </section>
    </div>
  );
}
