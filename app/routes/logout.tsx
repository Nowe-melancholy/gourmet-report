import type {
  ActionFunctionArgs,
  ActionFunction,
  LoaderFunction,
} from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { authenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = async () => {
  return redirect('/');
};
