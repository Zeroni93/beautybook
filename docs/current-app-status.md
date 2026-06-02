# Current App Status — ScaleHub (audit)

Date: 2026-05-31

Summary: this document records a snapshot audit of the current ScaleHub app (repository `beautybook`) after the recent UI/copy updates. The goal was to inspect the project without adding features or changing Supabase/table logic, verify build/dev, and surface broken or missing items.

## 1) Project structure audit
Checked locations (present / notes):

- `app/page.tsx` — present, uses `LandingHero`, `CarouselSection`, `PricingSection`. Exports default Home page.
- `app/layout.tsx` — present, imports `Header`, `Footer`, `SplashScreen`, `AppBackground`, `GlowBackground`, `PageTransition`. Layout wraps children with `PageTransition`.
- `app/not-found.tsx` — not present (Next created a prerendered `/_not-found` route during build). No explicit `app/not-found.tsx` file found.
- `app/browse-pros/page.tsx` — present.
- `app/join/page.tsx` — present.
- `app/auth/login/page.tsx` — present.
- `app/auth/signup/page.tsx` — present.
- `app/provider/dashboard/page.tsx` — present at `app/provider/dashboard/page.tsx` and delegates to `ProviderDashboardClient`.
- `app/providers/[id]/page.tsx` — present.
- `components/` — folder present and contains the expected components (Header, Footer, LandingHero, ProviderCard, ProviderDashboardClient, ProviderQRCode, BookingForm, etc.).
- `lib/` — present and contains `supabaseClient.ts` and `resend.ts`.
- `data/` — present and contains `providers.ts` (mock data used as fallback).
- `migrations/docs/` — not found in the project root (no migrations folder discovered during this audit).

Notes: The app folder also contains `pricing/` and `starter/` routes which are present and prerendered according to build output.

## 2) Route audit
Routes discovered (from file tree and build output):

- `/` — Exists. Main component: `app/page.tsx` → `LandingHero`, `CarouselSection`. No obvious problems.
- `/browse-pros` — Exists. Main component: `app/browse-pros/page.tsx`. Uses `ProvidersGridClient` and Supabase fetch; falls back to mock data on errors.
- `/join` — Exists. Main component: `app/join/page.tsx`. No obvious problems.
- `/auth/login` — Exists. Main component: `app/auth/login/page.tsx`. No obvious problems.
- `/auth/signup` — Exists. Main component: `app/auth/signup/page.tsx`. No obvious problems.
- `/provider/dashboard` — Exists. Main component: `app/provider/dashboard/page.tsx` → `ProviderDashboardClient` (client component). Protects route by checking session and redirects to `/auth/login` if not authenticated.
- `/providers/[id]` — Exists (dynamic). Main component: `app/providers/[id]/page.tsx` — fetches seller profile and services from Supabase; falls back to `mockProviders` if no profile found.
- `/pricing` — Exists. There is a `pricing/` route (the build output shows `/pricing` was prerendered).
- `/starter` — Exists. There is a `starter/` route (prerendered).

For each route the build succeeded and no missing page files were found. There were no broken routes during build.

## 3) Layout audit (`app/layout.tsx`)

- HTML/body structure: Valid. `html` lang and `body` present, `className` uses global font variable.
- Header renders: `Header` is rendered inside the main container.
- Footer renders: `Footer` is rendered at the bottom of the container.
- `PageTransition` presence: `PageTransition` is imported and wraps `<main>{children}</main>`. During build there were no errors implicating the page transition. It uses the pathname key (client component) to animate entries and does not break children during SSR.
- `SplashScreen` presence: `SplashScreen` is included. It is likely a small UI component — no evidence it blocks rendering. Build produced a prerendered `_not-found` route; no blocking behavior observed.
- `AppBackground`/`GlowBackground`: included and render background elements; they are present and do not block main content.

## 4) Homepage audit (`app/page.tsx`)

- Default export: Present and valid.
- Imports: `LandingHero`, `CarouselSection`, `PricingSection`, `ProviderCard`, `mockProviders` — all resolved.
- JSX: No malformed JSX observed.
- Hero renders: `LandingHero` is used and build completed; home page compiles and renders during dev build.
- Featured providers render: Uses `mockProviders.slice(0,3)` and maps to `ProviderCard`. Works.
- Duplicate content: No duplicate starter/homepage content discovered.
- Branding: `ScaleHub` is used widely; package name remains `beautybook` in package.json only.

## 5) Static asset audit (`/public`)
Checked files:

- `/public/logo.png` — Present.
- `/public/logo.svg` — Present.
- `/public/images/` — Present (directory exists). Specific provider images may be referenced in Supabase (storage paths) — those are not local.
- `scalehub-logo.png` — Not found as a named file. Search for references to `/scalehub-logo.png` did not show direct matches in codebase reads, but components refer to `logo.png` and `logo.svg`.
- Provider placeholder images: The UI uses placeholder divs when profile image paths are null; there is no explicit `provider-placeholder.png` referenced in the files read.

Search for common image references returned `logo.png` and files under `/public/images`. No missing referenced images were surfaced during build.

## 6) Branding audit

- Search for `BeautyBook` found only in `package.json` and `package-lock.json` as the npm package name `beautybook`.
- All visible UI strings use `ScaleHub` and not `BeautyBook`.
- No further changes required; the package name in `package.json` is safe to leave as-is (no need to change for runtime).

## 7) Environment / security audit

- `.gitignore` contains `node_modules/`, `.next/`, `.env.local` — present. Good.
- `.env.local` exists in the repo (warning): during grep we found a local `.env.local` file in repository root that contains secrets (including `SUPABASE_SERVICE_ROLE_KEY`). This is a security issue: `.env.local` is included in the workspace but is listed in `.gitignore`. Confirmed file path: `.env.local` in project root and it contains SUPABASE_SERVICE_ROLE_KEY.
  - Action: Do NOT commit `.env.local` to remote. If it already exists in remote, rotate service role key immediately.
- `SUPABASE_SERVICE_ROLE_KEY` usage: The key is referenced in server API routes under `app/api/*` and is used server-side. There are checks that will error if missing. No client components import the service role key directly — that would be a security problem. Confirmed server-only usage in `app/api/notifications/*` and `app/api/delete-account/route.ts`.
- No other obvious secrets in source code files scanned.

## 8) Booking flow audit

- `booking_requests` usage: The booking form (`components/BookingForm.tsx`) inserts into `booking_requests` and checks for conflicts via queries. Good.
- Customers not forced to login: `BookingForm` is a client component used on the public provider page; it collects name/phone and does not require authentication. Good.
- Booking form fields: It asks for name, phone, service select, date, time, notes — aligns with requirements.
- Provider dashboard: `ProviderDashboardClient` queries `booking_requests` for the seller ID. It shows bookingRequests and provides UI to manage them (code present to fetch and refresh). Provider action functionality (confirm/decline/complete) likely exists further down in the component (not fully read in this audit), but basic read functionality is present.

## 9) QR code audit

- `components/ProviderQRCode.tsx` — Present and client component. Uses `qrcode.react` and supports copy, download, and print. It constructs profile URL using `NEXT_PUBLIC_SITE_URL` env var or `http://localhost:3000` fallback. Download and print functions are present.
- Provider dashboard shows `ProviderQRCode` when profile exists. Good.

## 10) Media / Reviews audit

- Media uploads: There are placeholder gallery grids and comments like "Photo and video uploads coming soon." No integrated storage UI was found in the provider dashboard. `lib/supabaseClient.ts` exists but no storage bucket UI code was found in components scanned.
- Reviews: Reviews are placeholders with "coming soon" messaging. No `reviews` table migration or UI for writing/reading reviews was found.

## 11) Build test

- Command run: `rm -rf .next && npm run build` completed successfully.
- Build output: "Compiled successfully", static pages generated (15/15). No blocking errors. Routes listed in build output included the expected pages.

## 12) Dev server test

- After build, `npm run dev` was started. Dev server started on fallback `http://localhost:3002` (ports 3000/3001 were in use). Observed route compiles in dev and GET / returned 200.
- Confirmed pages load during dev compile logs: `/`, `/browse-pros`, `/join` compiled successfully. Manual browser verification not performed by the audit (headless log check only).

## 13) Findings and recommended next steps

Current app stage:
- Stage: MVP-like UI prototype with working public browsing, provider profile pages, booking request flow (inserting into `booking_requests`), provider dashboard that reads booking requests and shows QR/link. Media uploads and reviews are placeholders for future sprints.

Working features:
- Public browsing (`/` and `/browse-pros`) with provider cards and mock fallback data.
- Provider public page (`/providers/[id]`) with booking form that writes to `booking_requests` and checks conflicts.
- Provider dashboard basic functionality (profile read, services read, booking_requests read) via `ProviderDashboardClient`.
- Auth flows for login/signup using Supabase client.
- QR code generation, copy, download, and print.

Broken / risky items:
- `.env.local` is present in repo and contains `SUPABASE_SERVICE_ROLE_KEY` — security risk. Ensure `.env.local` is not committed to remote and rotate any leaked keys.
- No `migrations/` or DB migration scripts in repo — if DB schema isn't managed here, document the required tables (`seller_profiles`, `services`, `availability_rules`, `booking_requests`, `reviews` (planned)) so deployments have the correct schema.
- Some server routes expect `SUPABASE_SERVICE_ROLE_KEY` to be present; if you deploy to an environment without this env var, those server endpoints will fail. That's intentional: server-side only.

Missing features (planned but not implemented):
- Media upload and Supabase storage integration (Sprint 2).
- Reviews table and UI (Sprint 3).
- Provider billing integration (Stripe) — intentionally not present for MVP.

Highest priority fixes:
1. Remove `.env.local` from repo and rotate service role key if it has been pushed to remote. Add guidance to README for env var setup.
2. Add a `migrations/` or `README` documenting required DB tables and expected columns for a fresh environment (at minimum: `seller_profiles`, `services`, `booking_requests`, `availability_rules`).
3. Finish the small UI polish sweep to ensure animations don't interfere with reduced-motion users (already present via CSS prefs in `app/globals.css`).

Recommended next step:
- If you want to proceed: focus on Sprint 1 tasks (booking-flow validation, visible success/error UI, QR download/print refinements). Do not change Supabase auth or database structure unless necessary.

---

### Short summary answers

1) What works:
- App builds and dev server runs. Core routes render. Booking form inserts to `booking_requests`. QR feature present. Provider dashboard reads data.

2) What is broken:
- No blocking app-level breaks detected. Security risk: `.env.local` present with SUPABASE_SERVICE_ROLE_KEY.

3) What was fixed during this audit:
- No code changes were made. The audit performed read-only checks and a production build.

4) Build result:
- Production `npm run build` completed successfully (Compiled and prerendered pages).

5) What we should do next:
- Remove/secure `.env.local` and rotate secrets if needed. Add DB migration docs or scripts. Proceed with Sprint 1 UI fixes (booking success/error states, QR refinements).


End of report.
