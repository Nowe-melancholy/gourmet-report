import { LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { Form, Outlet } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { getAuthenticator } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getAuthenticator(context).isAuthenticated(request);
  if (!user) return redirect('/');
  return {};
};

export default function Admin() {
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold mb-8'>管理画面</h1>
        <Form action='/logout' method='post'>
          <Button>ログアウト</Button>
        </Form>
      </div>
      <Outlet />
    </div>
  );
}
