# Welcome to Remix + Cloudflare!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

- bun x --bun shadcn@latest add card

## Prisma

- bun prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_report.sql
- bun prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0002_user.sql
- npx wrangler d1 migrations apply gourmet-report --local
- npx wrangler d1 migrations apply gourmet-report --remote
- npx prisma generate
- bun wrangler d1 execute gourmet-report --local --file=./prisma/seed/report-test.sql
- wrangler d1 execute gourmet-report --command='SELECT id FROM report' --local
