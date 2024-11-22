import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  'food-picture': R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// すべてのルートにCORS設定を適用
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  })
);

const route = app.get('/api/getReports', async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const reports = await prisma.report.findMany();

  return c.json({ reports });
});

export default app;
// クライアント側で型情報を参照するためexport
export type AppType = typeof route;
