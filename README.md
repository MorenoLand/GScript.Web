# GS2 // CODEBASE

A retro, CRT-flavored front-end for the **GS2 Codebase** section of `Moreno.API` — a
public gallery for Graal Script 2 (GS2) snippets, projects and code. Anyone can browse;
authenticated panel users can publish, edit and delete their own snippets.

Pure **React 19 + TypeScript + Vite** SPA. Styling is hand-rolled **shadcn-style** UI
(Radix primitives + Tailwind) with a custom amber/phosphor retro theme. Code is
highlighted with Prism — GS2 reuses the JavaScript grammar.

## Features

- `/` — paginated snippet gallery (server-side `limit`/`offset`, 12 per page)
- `/snippet/:id` — full snippet: metadata, syntax-highlighted files (copy / download), image attachment gallery with lightbox
- `/new` — publish a multi-file snippet (auth)
- `/snippet/:id/edit` — edit your own snippets (owner or admin)
- `/login` — sign in via `POST /api/auth/login` (JWT stored locally)
- Optional **image attachments** per snippet (screenshots/diagrams) — stored server-side as `LONGBLOB`, shipped to the client as base64.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

By default the dev server proxies `/api` and `/up` to `http://localhost:5000`
(where `Moreno.API` listens). If your API runs elsewhere, set it:

```bash
# .env.local
VITE_API_TARGET=http://localhost:5000   # dev proxy target
# VITE_API_URL=https://api.moreno.land  # absolute base for production builds
```

Leave `VITE_API_URL` empty to keep requests relative (works when the built SPA is
served from the same origin as the API).

```bash
pnpm build       # type-check + production build
pnpm preview     # serve the production build
```

## How it talks to the API

| Action            | Endpoint                                  | Auth   |
| ----------------- | ----------------------------------------- | ------ |
| Browse / paginate | `GET  /api/gs2-codebase/?limit=&offset=`  | public |
| View snippet      | `GET  /api/gs2-codebase/{id}`             | public |
| Publish           | `POST /api/gs2-codebase/`                 | JWT    |
| Edit              | `PUT  /api/gs2-codebase/{id}`             | owner/admin |
| Delete            | `DELETE /api/gs2-codebase/{id}`           | owner/admin |
| Sign in           | `POST /api/auth/login`                    | —      |

`uploaderId` is taken from the JWT `sub` claim server-side; edit/delete are gated to
`role==admin || uploader_id==sub`.

## Backend note (image attachments)

`Moreno.API/Endpoints/GS2CodebaseEndpoints.cs` was extended so snippets accept an
optional `images[]` (base64 + mime). They are stored in a new
`gs2_codebase_images` table (LONGBLOB, `ON DELETE CASCADE`). Create it with the DDL in
[`Moreno.API/README.md`](../Moreno.API/README.md) (Database Setup section).

Validation mirrors the API: up to **8 images**, each ≤ **3 MB** decoded, `image/*` MIME.

## Tech

- React 19, React Router 7, TanStack Query 5
- Tailwind CSS 3 + `tailwindcss-animate`
- Radix UI primitives (dialog, tabs, select, tooltip, dropdown, label, separator, slot)
- `react-syntax-highlighter` (PrismLight, only the grammars we ship)
- lucide-react icons, sonner toasts
