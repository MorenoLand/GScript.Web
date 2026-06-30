# #gscript

React 19 + TypeScript + Vite front-end for `gscript.dev`.

The site hosts the #gscript landing page, resource links, showcase/gallery publishing, and legacy tool pages. Discord OAuth is used for publishing and account controls through `Moreno.API`.

Repository: https://github.com/MorenoLand/GScript.Web

## Routes

- `/` - landing page, Discord presence, latest showcase items, and main navigation
- `/resources` - resource archive for docs, tools, assets, downloads, and videos
- `/snippet/:id` - showcase item details, attached files, images, and downloads
- `/new` - publish a showcase item
- `/snippet/:id/edit` - edit an item
- `/login` - Discord OAuth login
- `?docs` - GScript documentation
- `?formats` - file format notes
- `?indexing` - graphics indexing guides
- `?beautify`, `?byte`, `?list`, `?graph`, `?changes` - legacy web tools

## Local

```bash
npm install
npm run dev
npm run build
```

Production builds use `https://api.moreno.land` unless `VITE_API_URL` is set.

## Publishing

Showcase items can include:

- title, description, author, and category
- one thumbnail image
- multiple text/code files
- up to 8 image attachments

The file importer only accepts text/code style files. Binary files, videos, archives, and other non-text uploads are rejected so they do not get parsed as source code in the detail view.

Supported text imports include common web/code files plus `.gs2`, `.gscript`, `.gs1`, `.nw`, `.gmap`, `.zelda`, `.graal`, and `.gani`.

Supported categories are defined in `src/lib/constants.ts`.

## API

| Action | Endpoint | Auth |
| --- | --- | --- |
| Browse | `GET /api/gscript-showcase?limit=&offset=` | public |
| View | `GET /api/gscript-showcase/{id}` | public |
| Publish | `POST /api/gscript-showcase` | Discord JWT |
| Edit | `PUT /api/gscript-showcase/{id}` | owner/admin |
| Delete | `DELETE /api/gscript-showcase/{id}` | owner/admin |
| Block user | `POST /api/gscript-showcase/blocked-users/{discordId}` | admin |
| Unblock user | `DELETE /api/gscript-showcase/blocked-users/{discordId}` | admin |

## Tech

- React 19
- React Router 7
- TanStack Query 5
- Tailwind CSS
- Radix UI primitives
- Prism syntax highlighting
- Moreno.API
# gscript
