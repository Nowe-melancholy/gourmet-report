import { LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { Form, Outlet } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { getAuthenticator } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getAuthenticator(context).isAuthenticated(request);
  if (!user) return redirect('/login');
  return {};
};

export default function Admin() {
  return (
    <>
      <div>管理画面</div>
      <Form action='/logout' method='post'>
        <Button>ログアウト</Button>
      </Form>
      <Outlet />
    </>
  );
}
