# CLAUDE.md — NADA E-Commerce (Capstone)

Persistent context for Claude Code. Read this file and `docs/PRD.md` before every task.
`docs/PRD.md` is the source of truth for requirements. If this file and the PRD conflict, follow the PRD and flag the conflict.

## 1. Project Summary
NADA is a single-brand e-commerce and storytelling catalog for Muslim women's modest wear.
MVP: catalog (filter/search), cart, checkout, payment (Midtrans Snap sandbox + manual-transfer fallback),
shipping rates & tracking (Biteship), About Us, Collection Story ("A Closer Look At" + "Shop the Story"),
customer accounts, and an admin panel.

## 2. Tech Stack (fixed — do not substitute without asking)
| Layer | Choice |
| --- | --- |
| Monorepo | npm workspaces (existing repo `Capstone-Nada`): `frontend`, `backend`, `packages/shared` |
| Frontend | React + Vite + TypeScript, React Router, TanStack Query, Zustand (guest cart, `persist`), React Hook Form + Zod, Tailwind CSS + shadcn/ui, Tiptap (admin editor), `react-helmet-async` or React 19 metadata tags |
| Backend | Node.js + Express + TypeScript, layered: route → controller → service → repository |
| DB | PostgreSQL 16 (Docker for local), Prisma ORM + migrations, extensions `citext`, `pg_trgm` |
| Auth | Server-side sessions: opaque token in `httpOnly; Secure; SameSite=Lax` cookie, SHA-256 hash stored in `sessions` table; argon2id password hashing |
| Jobs | pg-boss (order expiry every 5 min, auto-complete delivered orders after 3 days) |
| Payments | `midtrans-client` (Snap, sandbox) behind a `PaymentProvider` interface; `ManualPaymentProvider` fallback |
| Shipping | Biteship REST API behind a `ShippingProvider` interface; `MockShippingProvider` when no API key |
| Images | Cloudinary signed uploads (fallback: local `uploads/` in dev) |
| Email | Resend behind a `Mailer` interface; `ConsoleMailer` in dev |
| Validation | Zod schemas in `packages/shared`, used by both web and api |
| Logging | pino with `request_id` |
| Tests | Vitest (unit), Supertest (API integration against a test DB), Playwright (E2E) |

Do NOT use Next.js. Do NOT store auth tokens in localStorage/sessionStorage.

## 3. Repository Layout
```
Capstone-Nada/
├── frontend/                     # Vite React SPA (storefront + /admin)  — dev port 5173
│   └── src/
│       ├── app/                  # router, providers, layouts
│       ├── features/             # catalog, cart, checkout, account, collections, admin/*
│       ├── components/ui/        # shadcn/ui
│       ├── lib/                  # api client (fetch wrapper, credentials: 'include'), formatters
│       └── stores/               # zustand
├── backend/                      # Express API — port 5000
│   ├── prisma/                   # schema.prisma, migrations, seed.ts
│   └── src/
│       ├── modules/<domain>/     # *.routes.ts, *.controller.ts, *.service.ts, *.repository.ts, *.test.ts
│       ├── providers/            # payment/, shipping/, mail/, storage/
│       ├── jobs/                 # pg-boss workers
│       ├── middleware/           # auth, error, rate-limit, request-id, validate
│       └── config/               # env parsing with Zod (fail fast on missing vars)
├── packages/shared/              # zod schemas, enums, DTO types, money helpers
├── docs/PRD.md
├── docker-compose.yml            # postgres (+ test db)
├── .gitignore                    # node_modules, .env, *.log, dist
└── CLAUDE.md
```
Domains: `auth`, `catalog`, `collections`, `content`, `cart`, `addresses`, `shipping`, `checkout`, `orders`, `payments`, `webhooks`, `admin`.

## 4. Commands (keep these working)
```
npm install                         # from repo root (workspaces)
docker compose up -d                # or a local PostgreSQL with DATABASE_URL set
npm run -w backend db:migrate       # prisma migrate dev
npm run -w backend db:seed
npm run dev                         # frontend (5173) + backend (5000) concurrently; Vite proxies /api -> :5000
npm test                            # vitest + supertest
npm run e2e                         # playwright
npm run lint && npm run typecheck
```

## 5. Non-Negotiable Business Rules
1. **Money** is integer rupiah (`BigInt` in Prisma, serialized as number/string consistently via a shared helper). Never floats.
2. **Server computes all prices.** Client sends only `variantId`, `quantity`, `addressId`, `courierCode`, `courierService`. Subtotal, shipping cost, and total are recomputed server-side at checkout.
3. **Checkout is one DB transaction** (PRD §9.3.4): conditional stock decrement `UPDATE product_variants SET stock = stock - $qty WHERE id = $id AND is_active AND stock >= $qty` (sorted by variant id), insert order + items (snapshots) + inventory_movements + payment(pending) + status history, clear cart. Zero affected rows → rollback → HTTP 409.
4. **External calls (Midtrans, Biteship) never run inside the DB transaction.**
5. **Order status changes only through `orderStateMachine.transition()`**, which validates against the transition table in PRD §7.8, writes `order_status_histories`, and performs side effects (restock on expire/cancel, emails).
6. **Payment status is changed only by** a verified Midtrans webhook (`SHA512(order_id + status_code + gross_amount + serverKey)`) or an admin verifying a manual transfer. Never by the client redirect.
7. **Webhooks are idempotent**: insert into `payment_events` with unique `(provider, event_key)`; on conflict, return 200 and do nothing. Always return 200 once the event is recorded.
8. **Midtrans `order_id` = `payments.provider_order_id` = `{order_number}-{attempt}`**, unique per attempt. `item_details` must sum exactly to `gross_amount` (shipping as its own line). Snap `expiry` = 24h = `orders.payment_due_at`.
9. **Order snapshots**: shipping address, product name, variant label, SKU, unit price, image are copied into `orders`/`order_items`. No FK from orders to addresses.
10. **No hard delete** of products/variants that appear in any order → set `status='archived'` / `is_active=false`.
11. **Sold Out is derived** (sum of active variant stock = 0), never stored.
12. Checkout requires login. Guest cart lives in Zustand/localStorage and is merged via `POST /api/cart/merge` after login (sum quantities, cap at stock).
13. Secrets (Midtrans server key, Biteship key, Cloudinary secret) exist only in `backend` env. Web only gets `VITE_MIDTRANS_CLIENT_KEY` and `VITE_MIDTRANS_SNAP_URL`.

## 6. Conventions
- TypeScript `strict`. No `any` without a comment explaining why.
- API errors: `{ "error": { "code": "STOCK_INSUFFICIENT", "message": "...", "details": {} } }` via a central error handler and typed `AppError`.
- Validate every request body/query/params with Zod middleware using schemas from `packages/shared`.
- Prisma cannot express some constraints (CHECK, partial unique index, generated `tsvector`, GIN trigram). Add them in a hand-written SQL migration; declare `search_vector` as `Unsupported("tsvector")?`. Search uses `$queryRaw` with parameters only.
- UI copy is in **Bahasa Indonesia**; code, identifiers, and commits in English.
- Currency display: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
- Design direction: calm, minimal, editorial (reference: tazalabel.com, hellosaysara.com) — generous whitespace, serif display font + clean sans body, muted warm palette, large product photography, mobile-first. Every image has alt text; WCAG AA contrast; keyboard navigable.
- Each page sets its own `<title>` and meta description; API serves `GET /sitemap.xml`.
- Conventional Commits. Small, reviewable commits per logical step.

## 7. Environment Variables
`backend/.env.example`:
```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/nada_webapp
PORT=5000
DATABASE_URL_TEST=postgresql://postgres:<password>@localhost:5433/nada_webapp_test
SESSION_SECRET=
APP_URL=http://localhost:5173
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
PAYMENT_MANUAL_ENABLED=true
BITESHIP_API_KEY=            # empty => MockShippingProvider
BITESHIP_ORIGIN_AREA_ID=
BITESHIP_ORIGIN_POSTAL_CODE=
BITESHIP_WEBHOOK_SECRET=
CLOUDINARY_URL=              # empty => local disk storage
RESEND_API_KEY=              # empty => ConsoleMailer
MAIL_FROM="NADA <no-reply@nada.local>"
```
`frontend/.env.example`:
```
VITE_MIDTRANS_CLIENT_KEY=
VITE_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
```
Verify external API endpoints and payloads against the official Midtrans and Biteship documentation before implementing; do not guess field names.

## 8. Definition of Done (per feature)
- Matches the user story IDs and FRs in the PRD (reference IDs in PR/commit body).
- Zod validation, auth/role checks, and error cases handled.
- Unit tests for services; Supertest integration test for each endpoint (happy path + main failure).
- `npm run lint`, `npm run typecheck`, `npm test` all pass.
- UI is responsive at 375px and 1280px, has loading/empty/error states.
- No secrets committed; `.env.example` updated.

## 9. Existing Code Baseline (branch `Naufan`, Sept 2026)
The repo already contains an early prototype. Treat it as throwaway scaffolding to be refactored, not as a reference design:
- `backend/src/server.js`: single-file Express 5 (CommonJS) with `/api/register`, `/api/login`, `/api/test-db`;
  tables created at startup via `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE`. **Stores and compares plaintext passwords.**
  No session; login only returns the user object.
- `backend/src/db/pool.js`: hard-coded DB credentials.
- `frontend/`: Vite + React 19 + React Router 7 + Tailwind 4 (JSX). Landing page (`App.jsx`) with the NADA color palette;
  login/register pages use inline styles and save the user object to localStorage.
- `node_modules/` and `*.log` files are committed; there is no root `.gitignore`.
Keep: the Vite/React/Tailwind setup, the landing page color palette and typography feel, Indonesian UI copy.
Replace: everything in the backend, the auth flow, and the navigation items copied from the reference brand
(e.g. "TAZA WORLD", "26°RHAPSODY", "MEDIA ROOM") with NADA's own sitemap (PRD §10).
Login identifier is **email** (PRD `users` has `name`, not `username`).

## 10. Working Style
- Before coding a phase, output a short plan (files to create/change, tests to write) and wait for approval if the change touches the schema or business rules above.
- Run tests after each step; fix failures before moving on.
- When a requirement is ambiguous, check the PRD; if still unclear, ask instead of inventing behavior.
- Keep a running `docs/PROGRESS.md` checklist of phases and user stories done.
