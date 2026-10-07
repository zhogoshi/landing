# landing

The public hogoshi.dev page.

Repository: https://github.com/zhogoshi/landing

## What

One page: name, a rotating mark, and a line of cycling words. No API and no post routes.

## Why

The calling card is its own deploy. It does not boot the API, the database, or the other apps.

## Install and run

```bash
pnpm install
pnpm dev
```

Dev server: http://localhost:3000

## Docker

```bash
PORT=3010 docker compose up --build
```

The process binds `PORT`. When it is unset, it listens on `3000`. Compose publishes that same port. After `next build`, the image runs `obfuscate-hogoshi .next`. Local `pnpm dev` stays readable.

Dokploy builds this Compose file by itself. Set:

| Variable | When |
| --- | --- |
| `HUGEICONS_NPM_TOKEN` | Image build. Required. |
| `PORT` | Listen port. Default `3000`. |
| `SITE_URL` | Public origin of this service. |

Point the domain at that same container port.
