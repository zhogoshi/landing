# landing

hogoshi.dev. https://github.com/zhogoshi/landing

```bash
pnpm install
pnpm dev
```

http://localhost:3000

```bash
PORT=3010 docker compose up --build
```

`PORT` defaults to `3000`. The image build needs `HUGEICONS_NPM_TOKEN`. Set `SITE_URL` to the public origin. Push to `main` redeploys. `node scripts/deploy.mjs landing` does the same.
