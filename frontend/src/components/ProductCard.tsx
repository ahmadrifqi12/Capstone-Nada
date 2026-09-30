import { Link } from "react-router-dom";
import type { Product } from "../data/types";
import { isSoldOut } from "../data/products";
import { formatRupiah } from "../lib/format";
import Garment from "./Garment";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const soldOut = isSoldOut(product);
  const badge = soldOut ? "Habis" : product.isNew ? "Baru" : product.bestSeller ? "Terlaris" : null;

  return (
    <Link
      to={`/produk/${product.slug}`}
      className="group block rise"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <div className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.03]">
          <Garment shape={product.shape} color={product.colors[0].hex} label={`${product.name}, ${product.colors[0].name}`} />
        </div>
        {badge && (
          <span
            className={`absolute left-3 top-3 px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
              soldOut ? "bg-ink text-paper" : "bg-paper/90 text-ink"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="mt-0.5 text-xs text-muted">{product.category}</p>
        </div>
        <p className={`shrink-0 pt-1 text-sm ${soldOut ? "text-muted line-through" : "text-clay"}`}>
          {formatRupiah(product.price)}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-1.5" aria-label={`${product.colors.length} pilihan warna`}>
        {product.colors.map((col) => (
          <span
            key={col.name}
            title={col.name}
            className="h-3 w-3 rounded-full border border-ink/15"
            style={{ background: col.hex }}
          />
        ))}
      </div>
    </Link>
  );
}
