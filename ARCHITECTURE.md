# Project Architecture

This document explains the structure, key modules, and data flow of the Todo Pro application.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Redux Toolkit + RTK Query
- Zod for validation
- Tailwind v4 (via CSS variables and utility classes)
- MSW for mock API (optional in dev)
- Vitest + React Testing Library

## High-level flow

- Auth: Register/Login hit `/api/auth/*` (Node runtime). Sessions persisted in file-backed storage. Client stores token and adds Authorization header.
- Todos: CRUD over `/api/todos` and `/api/todos/[id]` with FS storage per user. RTK Query handles caching, invalidation, and optimistic updates.
- Theming: Central CSS variables in `app/globals.css` power light/dark modes and component tokens.

## Folder structure

- `app/`: Next.js app routes, layout, global CSS, and API routes (auth, todos).
- `src/@components/`: UI and feature components.
  - `common/`: Topbar, Theme provider, Skeleton, MSW loader.
  - `Todo/`: Todo list, item, filters, edit modal, form, etc.
  - `ui/`: Reusable atoms (Button, Input, Modal, Dropdown, Pagination, Search).
- `src/@features/`: Feature composites (Auth pages, Todos pages).
- `src/@store/`: Redux store, slices, and RTK Query services.
- `src/@schemas/`: Zod schemas for validation.
- `src/@lib/`: Helpers and server-side utilities (FS DB, tokens).
- `src/app/api/`: Route handlers with Node runtime for FS persistence.
- `src/@mocks/`: MSW handlers and browser setup.
- `src/@tests/`: Vitest + RTL tests.

## Data models

- Todo: `{ id, title, description?, status, priority?, dueDate?, createdAt, updatedAt }`
- User: `{ id, name, email, passwordHash }` (stored in FS for dev/demo only)
- Session: `{ id, userId, token, createdAt }`

## Key modules

- `src/@store/services/todoApi.ts`: RTK Query for todos with optimistic updates and tag invalidation.
- `src/@components/Todo/TodoItem.tsx`: Row UI, inline status toggle, edit/delete actions.
- `src/@components/Todo/TodoEditModal.tsx`: Modal for updating fields except title.
- `src/features/todos/TodosFeature.tsx`: Combines search, filters, pagination limit, and list.
- `src/features/todos/TodoDetailsFeature.tsx`: Details view with glassmorphism and skeleton.

## Theming tokens

Defined in `app/globals.css` with light/dark values:

- `--primary-color`, `--button-bg`, `--button-text`, `--surface`, `--foreground`, `--background`, etc.

## Testing

- Entry: `src/@tests/setup.ts`
- Specs: `src/@tests/*.spec.tsx`
- Run: `npm test`

## Dev mocks

- Toggle via `NEXT_PUBLIC_USE_MOCKS`. Loader in `src/@components/common/MSWLoader.tsx`.
