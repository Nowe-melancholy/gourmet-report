import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getAuthenticator(context).isAuthenticated(request);

  if (!user) {
    // 未ログインのユーザーはログインページにリダイレクト
    return redirect("/login");
  }
  return user;
};

export default function SuccessIndex() {
  const user = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Hello {user.name}さん</h1>
      <div>ログイン成功しました。</div>
      <div>
        <form action="/logout" method="post">
          <button type="submit">ログアウト</button>
        </form>
      </div>
    </>
  );
}
