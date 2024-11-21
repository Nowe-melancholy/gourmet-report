import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/components/ui/card';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    // ログイン済みのユーザーはサクセスページにリダイレクト
    return redirect('/success');
  }
  return {};
};

export default function Login() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            ログイン
          </CardTitle>
          <CardDescription className='text-center'>
            アカウントにログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <Form action='/auth/google' method='post'>
            <Button variant='outline' className='w-full'>
              Googleでログイン
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
