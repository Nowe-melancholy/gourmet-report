import { ReportRepository } from './repository/report.repository';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ReportModel } from './domain/report';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { UserRepository } from './repository/user.repository';

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
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

const route = app
  .get('/api/getReports', async (c) => {
    const reportRepo = ReportRepository.create(c.env.DB);
    const reports = await reportRepo.findAll();

    return c.json({
      reports: reports.map(
        ({
          id,
          name,
          rating,
          comment,
          link,
          imgUrl,
          dateYYYYMMDD,
          userId,
        }) => ({
          id,
          name,
          rating,
          comment,
          link,
          imgUrl,
          dateYYYYMMDD,
          userId,
        })
      ),
    });
  })
  .post(
    '/api/createReport',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        rating: z.string(),
        comment: z.string(),
        link: z.string(),
        image: z.instanceof(File),
        dateYYMMDD: z.string().regex(/^\d{8}$/),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody<{
        name: string;
        rating: string;
        comment: string;
        link: string;
        image: File;
        dateYYMMDD: string;
      }>();

      const imgKey = crypto.randomUUID();
      c.env.R2.put(imgKey, body.image);

      const userRepo = UserRepository.create(c.env.DB);
      const user = await userRepo.getUserByEmail(process.env.AUTHORIZED_EMAIL!);

      const report = ReportModel.create({
        id: crypto.randomUUID(),
        name: body.name,
        rating: parseInt(body.rating, 10),
        comment: body.comment,
        link: body.link,
        imgUrl: `${
          import.meta.env.NODE_ENV === 'development'
            ? 'local'
            : 'https://pub-98330438822b465584a1e00385eac515.r2.dev'
        }/${imgKey}`,
        dateYYYYMMDD: body.dateYYMMDD,
        userId: user.id,
      });

      const reportRepo = ReportRepository.create(c.env.DB);
      await reportRepo.create(report);
      return c.json(report);
    }
  );

export default app;
// クライアント側で型情報を参照するためexport
export type AppType = typeof route;
