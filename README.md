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

- DB が存在しない状態から migration ファイルを作成する
  - bun prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_xxx.sql
- すでに存在する DB をもとに migration ファイルを作成する
  - bun prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0002_xxx.sql
- ローカルの DB を migration する
  - npx wrangler d1 migrations apply gourmet-report --local
- リモートの DB を migration する
  - npx wrangler d1 migrations apply gourmet-report --remote
- prisma schema から typscript のコードを生成する
  - npx prisma generate
- SQL ファイルを実行する
  - bun wrangler d1 execute gourmet-report --local --file=./prisma/seed/report-test.sql
- SQL を実行する
  - wrangler d1 execute gourmet-report --command='SELECT id FROM report' --local
