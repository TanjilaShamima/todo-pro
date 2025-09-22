<div align="center">

# Todo Pro

Modern, full‑stack Task Manager built with Next.js 15, React 19, TypeScript, Redux Toolkit + RTK Query, and Zod. Features light/dark theming, file‑backed API routes for local persistence, pagination, search/filter, and a polished UI.

</div>

## ✨ Features

- Auth: Register/Login with file‑backed sessions (Node runtime)
- Todos CRUD: create, list, search, filter, sort, paginate (5/10/15/20/all)
- Details view with glassmorphism + skeleton while loading
- Inline status toggle, edit modal, delete confirmation
- Priority, status, and due date with overdue indicator
- Theming via CSS variables; consistent tokens for light/dark
- MSW for optional dev mocking
- Vitest + RTL tests, Playwright E2E
- Basic PWA (manifest + service worker)

## 🧱 Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Redux Toolkit + RTK Query
- Zod for validation
- Tailwind v4 utility classes + custom CSS variables
- MSW, Vitest, React Testing Library

## 📁 Folder Structure

```
todo-pro-by-tanjila/
├─ app/
│  ├─ layout.tsx            # Root layout, providers, Topbar, ToastContainer
│  ├─ globals.css           # Theme tokens and global styles
│  ├─ app/
│  │  └─ todos/
│  │     ├─ page.tsx        # Todos page (feature composition)
│  │     └─ [id]/page.tsx   # Todo details route
│  └─ api/
│     ├─ auth/              # Auth endpoints (register/login)
│     └─ todos/             # Todos CRUD endpoints
├─ public/                  # Static assets, PWA files
│  ├─ manifest.json         # Web App Manifest
│  └─ sw.js                 # Service Worker (minimal)
├─ src/
│  ├─ @components/
│  │  ├─ common/            # MSW loader, Skeleton, ThemeClient, Topbar
│  │  ├─ Todo/              # Todo UI (Item, List, Form, EditModal, Search)
│  │  └─ ui/                # Button, Input, Modal, Dropdown, Pagination, Search
│  ├─ @features/            # Auth and Todos feature composites
│  ├─ @lib/                 # Tokens, client utils, server FS helpers
│  ├─ @schemas/             # Zod schemas (auth, todo)
│  ├─ @store/               # Redux store, slices, RTK Query services
│  ├─ @mocks/               # MSW handlers and setup
│  └─ @tests/               # Vitest + RTL tests
├─ tests-e2e/               # Playwright end‑to‑end tests
├─ playwright.config.ts     # Playwright config
├─ README.md                # This file
└─ ARCHITECTURE.md          # Architecture & data flow overview
```

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
```

2. Run the dev server (Next.js)

```bash
npm run dev
```

Open http://localhost:3000.

## 🔧 Available Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – start prod server
- `npm run lint` – run ESLint
- `npm test` – run Vitest + RTL
- `npm run e2e` – run Playwright E2E tests
- `npm run e2e:ui` – run Playwright in UI mode

## ⚙️ Environment

- Node.js 18+ recommended
- APIs use Node runtime to read/write from a file‑backed “DB”. No external DB required.
- Optional: `NEXT_PUBLIC_USE_MOCKS=true` to enable MSW in dev (see `MSWLoader`).

## 🧪 Testing (Unit + E2E)

Use Vitest + React Testing Library:

```bash
npm test
```

End‑to‑end tests with Playwright:

```bash
# one‑time browser install
npx playwright install

# run E2E tests
npm run e2e

# optional: interactive UI
npm run e2e:ui
```

Covered flows (E2E):

- Auth redirects (unauthenticated → /login) and login redirect to /app/todos
- Todos CRUD (create with validation, update via modal, delete)
- Filters/search update the list
- Form validation errors render and UI enforces max lengths

## 🖌️ Theming

Colors and tokens are defined with CSS variables in `app/globals.css`. Components use these tokens for light/dark support.

## 🔒 Authentication

Auth endpoints are under `app/api/auth`. A simple file‑based session is used for local development. Client stores the token and RTK Query adds it to requests.

## 📦 Todos API

- List: `GET /api/todos` with `page`, `limit`, `q`, `status`, `sort`
- Get: `GET /api/todos/:id`
- Create: `POST /api/todos`
- Update: `PATCH /api/todos/:id`
- Delete: `DELETE /api/todos/:id`

Validation is done with Zod (see `src/@schemas/zodSchema.ts`).

## 📱 PWA

This app ships a minimal PWA setup:

- `public/manifest.json` and basic meta tags in `app/layout.tsx`
- `public/sw.js` registered at runtime (network‑first fallback)

Note: For production‑grade offline and caching, consider Workbox or a tailored caching strategy.

## 🗺️ More Docs

See `ARCHITECTURE.md` for a deeper dive into modules, flows, and design choices.
