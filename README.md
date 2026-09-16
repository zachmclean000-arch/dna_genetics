# DNA Genetics educational project

Independent school project. No affiliation with the original brand. No real sales, payments, delivery addresses, fulfilment or outbound emails. All orders and prices are simulated.

## Run

Requires Node.js 22.20 or newer. On Windows PowerShell use `npm.cmd` if script execution policy blocks `npm`.

We are currently working on the frontend first. Run only the frontend terminal command below: Vite uses local catalogue data and does not require PostgreSQL or the backend. Search, product pages and the bag work locally. Accounts, newsletter submission and order creation wait until backend integration; no submissions are silently saved or faked.

When backend work begins, copy `frontend/.env.example` to `frontend/.env.local`, set `VITE_USE_BACKEND=true`, restart Vite, and run both terminals. PostgreSQL runs as a separate Windows service. Production builds always use the backend.

**Terminal 1 — backend:**

```powershell
cd C:\Users\taleb\OneDrive\Desktop\dnagenetics\backend
npm.cmd run dev
```

Backend: http://127.0.0.1:3001/api/products. This returns JSON.

**Terminal 2 — frontend:**

```powershell
cd C:\Users\taleb\OneDrive\Desktop\dnagenetics\frontend
npm.cmd run dev
```

Frontend: http://127.0.0.1:5173. Open this address in your browser. Vite forwards `/api` requests to the separate backend process. Leave both terminals open; Ctrl+C stops each process. PostgreSQL keeps running independently as its Windows service.

Dependencies are already installed. For a fresh checkout, run `npm.cmd install` in the project root first. The root `npm.cmd run dev` remains available as a combined convenience command. `npm.cmd run build` and `npm.cmd start` serve a combined production preview on port 3001.

## Administrator account

No default password or public admin-registration endpoint is included. From the project root:

```powershell
$env:ADMIN_EMAIL = 'teacher@example.test'
$env:ADMIN_PASSWORD = 'replace-with-a-unique-long-password'
npm.cmd run create-admin -w backend
Remove-Item Env:ADMIN_PASSWORD
Remove-Item Env:ADMIN_EMAIL
```

Sign in at `/account`, then open `/admin`. Use fictional customer emails. Customers register through `/account` and cannot use administrative APIs.

## Deploying to Vercel

The repository includes `vercel.json` and an Express function entry point in
`api/index.js`. Vercel serves the Vite build from its CDN and sends `/api/*`
requests to the Express application.

1. Import the GitHub repository into Vercel with the repository root selected.
2. In the Vercel Marketplace, connect a PostgreSQL provider such as Neon,
   Supabase, or Prisma Postgres. It must provide `DATABASE_URL` to the project.
3. In project **Settings → Environment Variables**, add these values for
   Production and Preview:

   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `SMTP_USER`
   - `SMTP_APP_PASSWORD`
   - `ORDER_NOTIFICATION_EMAIL`

4. In the project **Storage** tab, create and connect a **public Vercel Blob**
   store. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
5. Deploy. The build generates Prisma Client, applies migrations, provisions
   the administrator, and builds the frontend.

Do not add `PGHOST=localhost` or local PostgreSQL credentials to Vercel. The
cloud deployment must use its managed `DATABASE_URL`. Keep all passwords in
Vercel environment variables; never commit `backend/.env`.

Product images uploaded locally remain in `backend/uploads`. Images uploaded
from the deployed administrator use Vercel Blob and remain available across
serverless deployments.

## Persistence

PostgreSQL is now the default. PostgreSQL 18 was found running on this computer as `postgresql-x64-18` at `localhost:5432`.

Create the database once in pgAdmin's Query Tool while connected to the existing `postgres` database:

```sql
CREATE DATABASE dna_genetics;
```

Alternatively, in PowerShell (enter your PostgreSQL password at the prompt):

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -p 5432 -U postgres -d postgres -W -c 'CREATE DATABASE dna_genetics;'
```

Edit `backend/.env` and enter the PostgreSQL password in `PGPASSWORD`. Change `PGUSER` if you use a different database account. This file is ignored by Git. For a fresh checkout, copy `backend/.env.example` to `backend/.env` first. The server loads this file independently of the terminal's current directory.

Start the backend. It creates `public.dna_genetics_state` and seeds the sample catalogue in `dna_genetics`. In pgAdmin, refresh the database's Tables list. Verify with `SELECT id, data FROM public.dna_genetics_state;`. PostgreSQL stores its files in the database service's configured data directory, outside this project; pgAdmin is its management interface, not the database server.

The earlier preview used `backend/data/dna_genetics.sqlite`. That file is preserved but is no longer used by default, and its records are not automatically copied to PostgreSQL. To explicitly run the old SQLite mode, set `DB_CLIENT=sqlite`. Browser tests continue to use isolated in-memory SQLite. PostgreSQL connection failures do not silently fall back to SQLite.

The current school-project repository stores catalogue, accounts and orders in a transactional JSON document in either database. PostgreSQL uses row locking; SQLite uses transactions. This deliberately small initial schema is not a normalized production commerce schema. Database writes serialize to prevent overselling inventory. Uploaded images are in `backend/uploads`; include that folder alongside the database in backups.

## Features

- React/Vite, React Router, shared storefront and separate admin layouts.
- Responsive homepage sections, desktop mega-menu and mobile navigation.
- API catalogue, search, category/stock filters, sorting, dynamic product gallery and related products.
- Persistent browser bag, customer accounts, simulated checkout, account order history.
- Admin product creation/editing/deletion, draft/active/archive states, stock, sale prices and homepage flags.
- Validated atomic JSON imports, local PNG/JPEG/WebP uploads, category creation/removal.
- Admin customer list, dashboard totals and simulated order review/cancellation. Cancellation restores inventory once.
- Password hashing, hashed expiring session tokens, HttpOnly cookies, server authorization and same-origin write checks.

Import sample: `frontend/public/examples/products.json`, also downloadable in the product dashboard. Slugs and SKUs must be unique; category must already exist. Only JSON import is implemented (the brief leaves format selection open).

## Checks

```powershell
npm.cmd test
npm.cmd run build
npx.cmd playwright test
```

Browser tests use installed Microsoft Edge. Run the build first. The browser test configuration starts the built application on port 3011 with isolated in-memory test storage.

## Visual status and limitations

Verified locally: production build; six backend tests; two browser suites covering customer checkout, admin product lifecycle, import rollback, upload validation, category protection and stock restoration. Homepage screenshots at 1440, 768 and 390 pixels are written to `test-results/` by the browser suite. Desktop and mobile screenshots were also visually inspected. No reference-site runtime asset URLs exist in the application.

The reference became accessible on 2026-09-07. The header and footer now use locally stored reference logos, the forest illustration, Knockout/Oswald/Roboto fonts and icon font. Their cream (`#faf7f2`), green (`#0b4d3c`), black (`#000000`) and newsletter yellow (`#f6c740`) backgrounds were taken from the reference styles. Desktop, tablet and mobile layouts, navigation, search and local assets were checked. With the frontend running, run `node tests/check-chrome.mjs` to repeat these checks; screenshots are saved under `reference/comparison/`.

Header/footer work is a close reconstruction, not a promise of pixel identity: newsletter copy is adapted, an independent-project notice is retained, and external links resolve to local pages. Menu counts reproduce the captured reference labels, not the eight-entry local catalogue. The banner below the header now uses both locally downloaded reference images, with fade transitions, previous/next controls, keyboard/swipe navigation, autoplay pause and reduced-motion support. Desktop/tablet use the original 1280:285 image ratio; mobile uses the measured 90px image height. Run `node tests/check-banner.mjs` with the frontend running to verify it. Product packaging and the sections beneath the banner remain placeholders. All runtime assets stay local.

Secondary informational pages are sample content. Reviews are learning tasks rather than fabricated customer testimonials. No cultivation guides are reproduced. Continue visual work on the homepage body after header/footer review.

PostgreSQL integration is implemented but requires a running PostgreSQL instance for validation. The server binds to loopback for classroom use. This is not a production store and does not include password reset email, payment integrations, shipping integrations or deployment infrastructure.

## Homepage reviews

`/admin/reviews` manages reviewer name, rating, text and publication status. Only published reviews are returned by `/api/reviews`; creation, editing, deletion and draft access require an administrator. Reviews persist in the existing `dna_genetics_state.data.reviews` JSONB array when PostgreSQL is configured (the explicit SQLite fallback stores the same state). Existing databases gain the collection on the first review save; no reset is needed.

Frontend-only development intentionally returns an empty review list. To use saved reviews, set `VITE_USE_BACKEND=true` in `frontend/.env.local`, restart Vite, and run the backend with your PostgreSQL connection configured. Sign in as an administrator and open `/admin/reviews`. No reference testimonials are imported and no third-party verification badge is claimed.

The homepage now replaces The DNA Way with The Crowd Has Spoken, followed by As Recommended By and an accessible FAQ accordion. FAQ answers describe the educational project and are adapted rather than copied policies. Recommendation logos reproduce reference artwork; they are not endorsements of this independent project.

Validation: all three Playwright integration suites pass, including review creation, draft privacy, publication, reload persistence, deletion, authorization and invalid-rating rejection. Integration tests use isolated SQLite storage, not a live PostgreSQL server. `node tests/check-reputation.mjs` checks the frontend sections at four widths. The story video loads an external Vimeo player only after clicking its preview; other reference images and fonts are served locally.
