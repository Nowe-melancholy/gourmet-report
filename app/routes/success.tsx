import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    // 未ログインのユーザーはログインページにリダイレクト
    return redirect('/login');
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
        <form action='/logout' method='post'>
          <button type='submit'>ログアウト</button>
        </form>
      </div>
    </>
  );
}
