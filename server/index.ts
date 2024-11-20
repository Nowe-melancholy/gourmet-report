import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// すべてのルートにCORS設定を適用
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

const route = app.get("/api/hello", (c) => {
  return c.json({ message: "Hello!" });
});

export default app;
// クライアント側で型情報を参照するためexport
export type AppType = typeof route;
