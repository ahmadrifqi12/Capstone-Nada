import { Link } from "react-router-dom";
import Meta from "../components/Meta";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <Meta title="Halaman tidak ditemukan" />
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-5xl font-light">Halaman ini tidak ada</h1>
      <p className="mt-4 text-sm text-muted">Mungkin tautannya berubah, atau produknya sudah tidak tersedia.</p>
      <Link to="/katalog" className="btn btn-solid mt-10">Kembali ke katalog</Link>
    </div>
  );
}
