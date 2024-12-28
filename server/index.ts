import { ReportRepository } from './repository/report.repository';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ReportModel } from './domain/report';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { UserRepository } from './repository/user.repository';
import { jwt, sign } from 'hono/jwt';

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

const baseImgUrl =
  process.env.NODE_ENV === 'development'
    ? 'local'
    : 'https://pub-98330438822b465584a1e00385eac515.r2.dev';

// すべてのルートにCORS設定を適用
app
  .use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
    })
  )
  .use('/api/auth/*', jwt({ secret: process.env.JWT_SECRET! }));

const route = app
  .get(
    '/api/login',
    zValidator('query', z.object({ email: z.string().email() })),
    async (c) => {
      const email = c.req.query().email;
      if (email !== process.env.AUTHORIZED_EMAIL)
        throw new Error('Unauthorized');

      const jwt = await sign({ email }, process.env.JWT_SECRET!);

      return c.json({ jwt });
    }
  )
  .get('/api/getReports', async (c) => {
    const reportRepo = ReportRepository.create(c.env.DB);
    const reports = await reportRepo.findAll();

    return c.json({
      reports: reports.map(
        ({
          id,
          shopName,
          name,
          place,
          rating,
          comment,
          link,
          imgUrl,
          dateYYYYMMDD,
          userId,
        }) => ({
          id,
          shopName,
          name,
          place,
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
  .get(
    '/api/getReportById',
    zValidator('query', z.object({ id: z.string() })),
    async (c) => {
      const reportRepo = ReportRepository.create(c.env.DB);
      const report = await reportRepo.findById(c.req.query().id);
      if (!report) throw new Error('Not Found');

      return c.json({
        id: report.id,
        shopName: report.shopName,
        name: report.name,
        place: report.place,
        rating: report.rating,
        comment: report.comment,
        link: report.link,
        imgUrl: report.imgUrl,
        dateYYYYMMDD: report.dateYYYYMMDD,
        userId: report.userId,
      });
    }
  )
  .post(
    '/api/auth/createReport',
    zValidator(
      'form',
      z.object({
        shopName: z.string(),
        name: z.string(),
        place: z.string(),
        rating: z.string(),
        comment: z.string(),
        link: z.string().nullish(),
        image: z.instanceof(File),
        dateYYMMDD: z.string().regex(/^\d{8}$/),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody<{
        shopName: string;
        name: string;
        place: string;
        rating: string;
        comment: string;
        link: string;
        image: File;
        dateYYMMDD: string;
      }>();

      const imgKey = crypto.randomUUID();
      await c.env.R2.put(imgKey, body.image);

      const userRepo = UserRepository.create(c.env.DB);
      const user = await userRepo.getUserByEmail(process.env.AUTHORIZED_EMAIL!);

      const report = ReportModel.create({
        id: crypto.randomUUID(),
        shopName: body.shopName,
        name: body.name,
        place: body.place,
        rating: parseInt(body.rating, 10),
        comment: body.comment,
        link: body.link,
        imgUrl: `${baseImgUrl}/${imgKey}`,
        dateYYYYMMDD: body.dateYYMMDD,
        userId: user.id,
      });

      const reportRepo = ReportRepository.create(c.env.DB);
      await reportRepo.create(report);
      return c.json(report);
    }
  )
  .put(
    '/api/auth/updateReport',
    zValidator(
      'form',
      z.object({
        id: z.string(),
        shopName: z.string(),
        name: z.string(),
        place: z.string(),
        rating: z.string(),
        comment: z.string(),
        link: z.union([z.string().url(), z.literal('null')]),
        image: z.union([z.instanceof(File), z.literal('null')]),
        dateYYYYMMDD: z.string().regex(/^\d{8}$/),
      })
    ),
    async (c) => {
      const payload = c.get('jwtPayload');
      if (payload.email !== process.env.AUTHORIZED_EMAIL)
        throw new Error('Unauthorized Email');

      const body = await c.req.parseBody<{
        id: string;
        shopName: string;
        name: string;
        place: string;
        rating: string;
        comment: string;
        link: string;
        image: File | string;
        dateYYYYMMDD: string;
      }>();

      const userRepo = UserRepository.create(c.env.DB);
      const user = await userRepo.getUserByEmail(process.env.AUTHORIZED_EMAIL!);

      const reportRepo = ReportRepository.create(c.env.DB);
      const report = await reportRepo.findById(body.id);

      if (!report) {
        return c.json({ message: 'not found' }, 404);
      }

      const imgUrl = await (async () => {
        if (body.image !== 'null') {
          const imgKey = crypto.randomUUID();
          await c.env.R2.put(imgKey, body.image);
          await c.env.R2.delete(report.imgUrl.replace(`${baseImgUrl}/`, ''));

          return `${baseImgUrl}/${imgKey}`;
        } else {
          return report.imgUrl;
        }
      })();

      report.update({
        shopName: body.shopName,
        name: body.name,
        place: body.place,
        rating: parseInt(body.rating, 10),
        comment: body.comment,
        link: body.link,
        imgUrl,
        dateYYYYMMDD: body.dateYYYYMMDD,
        userId: user.id,
      });

      await reportRepo.update(report);
      return c.json(report);
    }
  )
  .delete(
    '/api/auth/deleteReport',
    zValidator('query', z.object({ id: z.string() })),
    async (c) => {
      const reportRepo = ReportRepository.create(c.env.DB);
      const { imgUrl } = await reportRepo.delete(c.req.query().id);
      await c.env.R2.delete(imgUrl.replace(`${baseImgUrl}/`, ''));
      return c.json({ message: 'success' });
    }
  );

export default app;
// クライアント側で型情報を参照するためexport
export type AppType = typeof route;
