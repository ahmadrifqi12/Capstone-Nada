import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "./Layout";

// Route-level code splitting (PRD §8 Performance). Home stays eager for LCP.
const Catalog = lazy(() => import("../pages/Catalog"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Collections = lazy(() => import("../pages/Collections").then((m) => ({ default: m.CollectionsIndex })));
const CollectionStory = lazy(() => import("../pages/Collections").then((m) => ({ default: m.CollectionStory })));
const About = lazy(() => import("../pages/About"));
const Faq = lazy(() => import("../pages/Faq"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Account = lazy(() => import("../pages/Account"));
const Login = lazy(() => import("../pages/Auth").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("../pages/Auth").then((m) => ({ default: m.Register })));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="katalog" element={<Catalog />} />
          <Route path="produk/:slug" element={<ProductDetail />} />
          <Route path="koleksi" element={<Collections />} />
          <Route path="koleksi/:slug" element={<CollectionStory />} />
          <Route path="cerita-kami" element={<About />} />
          <Route path="faq" element={<Faq />} />
          <Route path="keranjang" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="akun" element={<Account />} />
          <Route path="masuk" element={<Login />} />
          <Route path="daftar" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
