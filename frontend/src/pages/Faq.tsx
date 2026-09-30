import Meta from "../components/Meta";

const groups = [
  {
    id: "pengiriman",
    title: "Pengiriman",
    items: [
      ["Berapa lama pesanan diproses?", "Pesanan yang sudah dibayar diproses 1–2 hari kerja dan dikirim dari Bandung. Nomor resi dikirim lewat email begitu paket diserahkan ke kurir."],
      ["Kurir apa yang tersedia?", "Kami bekerja sama dengan beberapa kurir. Pilihan dan ongkos kirim muncul otomatis di halaman checkout setelah kamu memilih alamat."],
      ["Berapa batas waktu pembayaran?", "24 jam sejak pesanan dibuat. Setelah itu pesanan otomatis dibatalkan dan stok dikembalikan."],
    ],
  },
  {
    id: "penukaran",
    title: "Penukaran & pengembalian",
    items: [
      ["Bisakah menukar ukuran?", "Bisa, selama barang belum dicuci dan label masih terpasang, dalam 7 hari setelah diterima. Ongkos kirim penukaran ditanggung pembeli."],
      ["Bagaimana jika barang cacat?", "Kirim foto dan video unboxing ke hello@nada.id dalam 2 hari setelah barang diterima. Kami akan mengganti atau mengembalikan dana."],
      ["Apakah ada refund otomatis?", "Belum. Pengembalian dana diproses manual oleh admin kami setelah barang diterima dan diperiksa."],
    ],
  },
  {
    id: "ukuran",
    title: "Ukuran & perawatan",
    items: [
      ["Bagaimana memilih ukuran?", "Bandingkan lingkar dada dan panjang badan dengan tabel di halaman produk. Jika ragu di antara dua ukuran, pilih yang lebih besar untuk potongan longgar."],
      ["Apakah bahan menyusut?", "Kain kami dicuci sebelum dipotong sehingga penyusutan sangat kecil. Ikuti petunjuk perawatan di setiap halaman produk."],
    ],
  },
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 md:pt-16">
      <Meta title="FAQ & Kebijakan" description="Pertanyaan umum tentang pengiriman, penukaran, ukuran, dan perawatan produk NADA." />
      <p className="eyebrow">Bantuan</p>
      <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">FAQ &amp; kebijakan</h1>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="mt-14 scroll-mt-40">
          <h2 className="font-serif text-2xl">{g.title}</h2>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {g.items.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px]">
                  {q}
                  <span className="text-lg text-muted transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
