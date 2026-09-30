# Progress

Phase 1 (foundation) and the storefront UI of Phase 4 are done as a front-end-only slice. Data is local mock data in `frontend/src/data`; there is no API yet.

- [x] Frontend migrated to TypeScript (Vite, React 19, React Router 7, Tailwind 4, Zustand)
- [x] NADA sitemap and layout (header, footer, cart drawer), copy in Bahasa Indonesia
- [x] Home: hero, featured, "A Closer Look At", Our Story, values (PRD §10)
- [x] Catalog with filters synced to URL, search with typo tolerance, sort, mobile filter drawer (KAT-01..03, 06)
- [x] Product detail: colour swatches, per-variant stock, size chart (KAT-04)
- [x] Collections lookbook + collection story + Shop the Story (KAT-05, STR-01, STR-02)
- [x] About, FAQ, 404 (ABT-01)
- [x] Guest cart in Zustand, capped at stock, prices read from catalog (CRT-01..03, 05)
- [x] Checkout UI (address, courier, payment choice, summary) with validation only
- [x] Login / register / account pages as presentation only, nothing stored client-side
- [ ] Backend: refactor to TypeScript layered API, Prisma schema, seed (Phases 1-2)
- [ ] Auth and sessions (Phase 3)
- [ ] Server cart + merge, addresses, shipping, checkout, payments, orders, admin (Phases 5-9)
- [ ] Real product photography (garments are placeholder illustrations)
- [ ] Hardening: E2E, Lighthouse, deployment (Phase 10)
