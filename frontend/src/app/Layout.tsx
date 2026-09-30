import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Lewati ke konten
      </a>
      <Header />
      <main id="konten">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
