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
    <main className="landing-page">
      <header className="site-header">
        <div className="header-top">
          <div className="header-spacer" />
          <button className="brand-button" type="button" aria-label="NADA home">
            nada.
          </button>
          <div className="header-actions">
            <Link
              to="/login"
              className="icon-button account-button"
              aria-label="Open login and register page"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12.2c2.3 0 4.2-1.9 4.2-4.2S14.3 3.8 12 3.8 7.8 5.7 7.8 8s1.9 4.2 4.2 4.2Zm0 2.1c-3.6 0-6.8 2.1-8.2 5.2-.2.4.1.8.5.8h15.4c.4 0 .7-.4.5-.8-1.4-3.1-4.6-5.2-8.2-5.2Z" />
              </svg>
            </Link>
            <button
              className="icon-button decorative-icon"
              type="button"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m20.3 19-4.6-4.6c1-1.2 1.5-2.7 1.5-4.3 0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7c1.6 0 3.1-.5 4.3-1.5l4.6 4.6 1.2-1.2ZM5 10.1C5 7.2 7.3 4.9 10.2 4.9s5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2S5 13 5 10.1Z" />
              </svg>
            </button>
            <button
              className="icon-button decorative-icon"
              type="button"
              aria-label="Bag"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 8.2V7c0-2.8 2.2-5 5-5s5 2.2 5 5v1.2h2.1l1 13.8H3.9l1-13.8H7Zm1.8 0h6.4V7c0-1.8-1.4-3.2-3.2-3.2S8.8 5.2 8.8 7v1.2Zm-2.2 1.7-.7 10.3h12.2l-.7-10.3H6.6Z" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button className="nav-link" type="button" key={item}>
              {item}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero-section" aria-label="Summer Marche hero section">
        <div className="stripe-background" />
        <div className="hero-art" aria-hidden="true">
          <div className="kiosk-roof" />
          <div className="kiosk-body">
            <div className="awning" />
            <span className="kiosk-logo">nada</span>
            <div className="counter-top" />
          </div>
          <div className="fruit fruit-one" />
          <div className="fruit fruit-two" />
          <div className="fruit fruit-three" />
          <div className="leaf leaf-one" />
          <div className="leaf leaf-two" />
        </div>

        <div className="hero-copy">
          <p className="summer-title">
            SUMMER ☼ MARCHÉ <span>VOL. 2</span>
          </p>
          <h1>26°RHAPSODY</h1>
          <div className="hero-links">
            <button type="button">Lookbook</button>
            <button type="button">Shop The Collection</button>
          </div>
        </div>

        <div className="event-card">
          <p>Barnyard</p>
          <span>Jl. Kemang Selatan II No. 6, Jakarta Selatan</span>
          <strong>17 - 20 September 2026 | 09.00 - 20.00</strong>
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
