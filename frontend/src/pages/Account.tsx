import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const sections = [
  ["Profil", "Nama, email, dan kata sandi."],
  ["Alamat tersimpan", "Simpan beberapa alamat agar checkout lebih cepat."],
  ["Riwayat pesanan", "Lihat status pembayaran dan lacak resi pengiriman."],
];

export default function Account() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 md:pt-16">
      <Meta title="Akun Saya" />
      <p className="eyebrow">Akun saya</p>
      <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">Masuk untuk melihat akunmu</h1>
      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
        Dengan akun, keranjangmu tersimpan di semua perangkat dan pesanan bisa dilacak dari satu tempat.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/masuk" className="btn btn-solid">Masuk</Link>
        <Link to="/daftar" className="btn btn-line">Daftar</Link>
      </div>
      <ul className="mt-16 divide-y divide-line border-y border-line">
        {sections.map(([t, d]) => (
          <li key={t} className="flex items-baseline justify-between gap-6 py-5">
            <span className="font-serif text-xl">{t}</span>
            <span className="text-right text-sm text-muted">{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
