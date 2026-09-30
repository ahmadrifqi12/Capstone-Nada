# Prompt Instruksi Claude Code — NADA

## Prompt 0 — Kickoff & Planning
```
Read CLAUDE.md and docs/PRD.md fully. We are building the NADA e-commerce web app described there.

Do not write code yet. Produce:
1. A phase-by-phase implementation plan (Phases 1–10 below), mapping every PRD user story ID
   (KAT-*, CRT-*, CHK-*, ABT-*, STR-*, AUTH-*, ACC-*, ADM-*) to the phase that implements it.
2. A list of ambiguities or conflicts you found between CLAUDE.md and the PRD, with your proposed resolution.
3. Create docs/PROGRESS.md containing that checklist.

Phases:
1. Refactor existing prototype into the target foundation (cleanup, workspaces, TypeScript, tooling)
2. Database schema, migrations, seed
3. Auth & sessions
4. Catalog, collections, content API + storefront pages
5. Cart (server + guest + merge)
6. Addresses & shipping (Biteship + mock)
7. Checkout & payment (Midtrans Snap + manual fallback + webhook)
8. Order lifecycle: state machine, scheduler jobs, emails, customer order pages
9. Admin panel
10. Hardening: E2E, performance, SEO, accessibility, deployment config, README

Stop after the plan and wait for my approval.
```

## Prompt 1 — Refactor Existing Prototype
```
Implement Phase 1. The repo is NOT empty: read CLAUDE.md §9 (Existing Code Baseline) and inspect the current code first.
Show me a short plan, then:
1. Repo hygiene: add a root .gitignore (node_modules, .env*, !.env.example, *.log, dist, coverage),
   `git rm -r --cached` all node_modules and root *.log files. Do not delete source files.
2. Remove hard-coded DB credentials from backend/src/db/pool.js; read DATABASE_URL and PORT from env
   (Zod-validated config, fail fast). Add backend/.env.example and frontend/.env.example per CLAUDE.md §7.
   Remind me in your summary to change the local Postgres password that was committed.
3. Convert the root into npm workspaces: frontend, backend, packages/shared. Root scripts: dev (concurrently),
   build, lint, typecheck, test, e2e.
4. Backend: migrate to TypeScript (ESM, tsx watch for dev, tsc build), Express 5 kept.
   Create the layered structure from CLAUDE.md §3 with modules/health only for now (GET /api/health checks DB),
   pino logger with request_id, central error handler with AppError, helmet, CORS restricted to APP_URL with credentials.
   Delete the startup `ensureUsersTable`/`ensureLoginLogsTable` logic and the old /api/register, /api/login,
   /api/test-db routes (auth is rebuilt properly in Phase 3; schema comes from Prisma in Phase 2).
5. Frontend: migrate to TypeScript (tsx), keep Vite 8 / React 19 / React Router 7 / Tailwind 4 and the existing
   color palette. Initialize shadcn/ui, TanStack Query, an api client (fetch, credentials: 'include').
   Extract the landing page into features/home with a shared root layout (Header, Footer).
   Replace the copied reference-brand nav items with NADA routes from PRD §10
   (Koleksi, Katalog, Cerita Kami, akun, cari, keranjang) as placeholder pages.
   Remove the localStorage user storage from login.jsx; keep login/register pages as placeholders until Phase 3.
   Set index.html lang="id" and title "NADA — Busana Muslimah".
   Vite proxy: /api -> http://localhost:5000 (keep).
6. ESLint (or keep oxlint) + Prettier + strict tsconfig base shared by both apps.
Acceptance: `npm install && npm run dev` starts both apps; home page shows API health via the proxy;
lint and typecheck pass; `git status` shows no tracked node_modules or logs; no credentials in the codebase.
Create docs/PROGRESS.md, then commit in logical steps (chore: gitignore, refactor: ts backend, refactor: ts frontend, ...).
```

## Prompt 2 — Database
```
Implement Phase 2: translate PRD §9.3.3 DDL into backend/prisma/schema.prisma (replacing the old ad-hoc users and login_logs tables; login_logs is not in the PRD — drop it).
- Use Prisma enums matching the PRD, BigInt for money, UUID ids, snake_case table/column names via @@map/@map.
- Add a hand-written SQL migration for what Prisma cannot express: CHECK constraints, partial unique index
  uq_address_default, generated search_vector tsvector column + GIN index, pg_trgm index, citext for users.email.
- Seed script (idempotent): 1 admin (credentials from env), 2 customers, categories (Gamis, Abaya, Khimar, Set, Outer),
  2 published collections with Indonesian story content (Tiptap JSON), 12 products with realistic Indonesian names,
  materials, weight_gram, 3 colors × 4 sizes variants with varied stock (including some 0), placeholder images,
  size charts, and pages 'about' and 'faq'.
- Repository-layer helpers in packages/shared for money formatting and BigInt serialization.
Acceptance: `prisma migrate reset` + seed runs clean; an integration test asserts the stock CHECK (>= 0) and the
single-default-address constraint are enforced by the database. Update PROGRESS.md and commit.
```

## Prompt 3 — Auth
```
Implement Phase 3 (AUTH-01, AUTH-02, AUTH-03 as Should).
- POST /api/auth/register, /login, /logout, GET /api/auth/me, POST /forgot-password, /reset-password.
- argon2id hashing; opaque session token in httpOnly Secure(prod) SameSite=Lax cookie; store SHA-256 hash in sessions;
  30-day expiry with rotation on login; logout revokes.
- Middleware requireAuth and requireRole('admin'); rate limit on login/register/forgot-password.
- Web: login/register pages (React Hook Form + shared Zod schemas), auth context from /auth/me, protected route
  wrapper, redirect back to intended page after login.
Acceptance: Supertest covers register, duplicate email (409), wrong password (401), me with/without cookie,
admin-only route (403 for customer). Commit.
```

## Prompt 4 — Catalog, Collections, Content
```
Implement Phase 4 (KAT-01..06, STR-01..02, ABT-01..03).
API:
- GET /api/products with filters category, collection, color, size, min_price, max_price, q, sort (newest, price_asc,
  price_desc), pagination (24/page). Search via parameterized $queryRaw combining full-text and trigram similarity.
  Only status='active'. Include derived isSoldOut and price range from variants.
- GET /api/products/:slug (variants, images grouped by color, size chart), GET /api/categories,
  GET /api/collections, GET /api/collections/:slug (story + products), GET /api/pages/:slug, GET /sitemap.xml.
Web:
- Home (PRD §10 homepage structure), catalog with filters synced to URL search params and mobile filter drawer,
  product detail (color swatches switch gallery, size selector with per-variant availability, size chart dialog),
  collections list (lookbook grid), collection story page rendering Tiptap JSON with "Shop the Story" grid,
  About page.
- Design per CLAUDE.md §6: minimal editorial aesthetic, serif display + sans body, muted warm palette.
- Per-page <title>/meta description. Lazy-load images; route-level code splitting.
Acceptance: API tests for each filter and search typo tolerance; pages responsive at 375px and 1280px with
loading/empty/error states. Commit.
```

## Prompt 5 — Cart
```
Implement Phase 5 (CRT-01..05).
- Server cart for logged-in users: GET /api/cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id,
  POST /cart/merge. Prices always read from DB; soft stock check on add/update returns 409 STOCK_INSUFFICIENT
  with available quantity.
- Guest cart in Zustand with persist (variantId + quantity only); on login call /cart/merge then clear local cart.
- Cart drawer + cart page: quantity stepper, remove, subtotal, warnings for out-of-stock/inactive variants.
- TanStack Query optimistic updates with rollback on error.
Acceptance: tests for merge (sum and cap at stock), price not taken from client, 409 on over-stock. Commit.
```

## Prompt 6 — Addresses & Shipping
```
Implement Phase 6 (CHK-01, CHK-02, ACC-02).
- Address CRUD with single default (DB-enforced).
- ShippingProvider interface { searchArea, getRates, createShipment, track } with BiteshipShippingProvider
  (verify endpoints/payloads in official Biteship docs) and MockShippingProvider (deterministic rates for 3 couriers)
  selected when BITESHIP_API_KEY is empty.
- GET /api/shipping/areas?q= (address form autocomplete stores area_id + postal code),
  POST /api/shipping/rates { addressId } computing total weight/dimensions from the user's cart on the server.
- Address form and address picker components.
Acceptance: unit tests for weight aggregation and provider selection; integration test with the mock provider. Commit.
```

## Prompt 7 — Checkout & Payment
```
Implement Phase 7 (CHK-03, CHK-04, CHK-05 partial, CHK-07, CHK-08, ADM-04 API). Follow CLAUDE.md §5 rules 1–8 strictly.
- POST /api/checkout { addressId, courierCode, courierService, paymentMethod: 'midtrans' | 'manual', note? }
  with required Idempotency-Key header (same key + same user returns the original order).
  Re-fetch shipping rate server-side, run the single DB transaction from PRD §9.3.4, generate order_number
  NADA-YYYYMMDD-XXXX, payment_due_at = now + 24h.
- PaymentProvider interface { createTransaction, verifyNotification, mapStatus, cancel } with MidtransSnapProvider
  (midtrans-client, sandbox) and ManualPaymentProvider (gated by PAYMENT_MANUAL_ENABLED).
- POST /api/webhooks/midtrans: verify signature, idempotent insert into payment_events, map status per PRD §9.4.3,
  call orderStateMachine.transition, respond 200.
- POST /api/orders/:number/pay (new attempt with suffix -2, -3…), POST /orders/:number/cancel (also cancels at Midtrans),
  POST /orders/:number/payment-proof (manual), POST /api/admin/payments/:id/verify.
- Web: single-page checkout (address → courier → summary), load Snap script from VITE_MIDTRANS_SNAP_URL,
  call window.snap.pay(token); order status page polls GET /api/orders/:number until status changes.
Acceptance tests (must pass):
  1. Concurrency: 10 parallel checkouts for a variant with stock 1 → exactly 1 order, stock 0, 9 × 409.
  2. Duplicate webhook delivery changes state once.
  3. Invalid signature → 401-equivalent handling, no state change, event logged with signature_valid=false.
  4. Tampered client price is ignored.
Document how to expose the local API for webhooks (ngrok/cloudflared) in docs/DEV.md. Commit.
```

## Prompt 8 — Order Lifecycle
```
Implement Phase 8 (CHK-05, CHK-06, ACC-01).
- orderStateMachine with the transition table from PRD §7.8 as data, fully unit-tested (every allowed and a sample of
  forbidden transitions). Side effects: restock + inventory_movements(reason='release') on expire/cancel.
- pg-boss jobs: expire-unpaid-orders (every 5 min), auto-complete-delivered (daily, after 3 days).
- Mailer interface with Resend + ConsoleMailer; emails: order created (with pay link), payment received, shipped (waybill
  + tracking link). Simple responsive HTML templates in Indonesian.
- POST /api/webhooks/biteship updating shipments and moving orders to delivered.
- Web: order history list, order detail with status timeline (from order_status_histories), tracking info,
  "Bayar Sekarang", "Batalkan", and "Pesanan Diterima" actions.
Acceptance: job tests using a fake clock; restock verified via inventory ledger. Commit.
```

## Prompt 9 — Admin Panel
```
Implement Phase 9 (ADM-01..07, STR-03, ABT via pages) under /admin, requireRole('admin'), lazy-loaded.
- Dashboard: today's orders, pending verification count, low-stock variants, simple sales chart (ADM-07).
- Products: list/search, create/edit form with variants matrix (color × size, SKU auto-generate, stock),
  image upload via POST /api/admin/uploads/sign (Cloudinary signed upload; local fallback), archive instead of delete
  when referenced by orders.
- Stock adjustments with reason, writing inventory_movements; per-variant movement history.
- Collections and pages editor with Tiptap, cover upload, SEO fields, publish/unpublish.
- Orders: filter by status, detail view, allowed-next-status buttons derived from the state machine,
  manual payment proof review (approve/reject), create shipment (Biteship booking or manual waybill).
Acceptance: API tests for admin authorization and archive-vs-delete rule; forms validated with shared Zod schemas. Commit.
```

## Prompt 10 — Hardening & Delivery
```
Implement Phase 10.
- Playwright E2E: browse → filter → add to cart as guest → login → merge → checkout (mock shipping,
  Midtrans sandbox or a stubbed provider in test env) → simulated webhook → order shows "Dibayar";
  admin processes and ships the order.
- Lighthouse pass on home, catalog, product pages (mobile): fix issues to reach targets in PRD §11.
- Security review: helmet, CORS locked to APP_URL, rate limits, no secrets in web bundle, dependency audit.
- Deployment: vercel.json for frontend with SPA fallback and /api/* rewrite to the API host;
  Render/Railway config for backend (build, migrate deploy, start, pg-boss); Neon/Supabase notes.
- README: setup, env, scripts, architecture diagram, test accounts, Midtrans sandbox test instructions.
- Final docs/PROGRESS.md: every PRD user story marked done with the test that proves it.
```

---

## Prompt Utilitas (dipakai kapan saja)
**Review fase:**
```
Review everything changed in this phase against CLAUDE.md §5 business rules and §8 Definition of Done.
List violations or gaps with file/line references, then fix them and re-run lint, typecheck, and tests.
```
**Perbaikan bug:**
```
Bug: <deskripsi + langkah reproduksi + perilaku yang diharapkan>.
First write a failing test that reproduces it, then fix the root cause, then confirm all tests pass.
Do not change business rules in CLAUDE.md §5 without asking.
```
**Sinkronisasi dengan PRD:**
```
docs/PRD.md was updated (see diff). Identify affected modules, propose changes, and wait for approval before editing.
```
