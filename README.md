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
- Vitest + RTL tests

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
├─ public/                  # Static assets
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

## ⚙️ Environment

- Node.js 18+ recommended
- APIs use Node runtime to read/write from a file‑backed “DB”. No external DB required.
- Optional: `NEXT_PUBLIC_USE_MOCKS=true` to enable MSW in dev (see `MSWLoader`).

## 🧪 Testing

Use Vitest + React Testing Library:

```bash
npm test
```

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

## 🗺️ More Docs

See `ARCHITECTURE.md` for a deeper dive into modules, flows, and design choices.
