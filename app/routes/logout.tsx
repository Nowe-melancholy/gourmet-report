import type {
  ActionFunctionArgs,
  ActionFunction,
  LoaderFunction,
} from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { getAuthenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  return await getAuthenticator(context).logout(request, {
    redirectTo: '/',
  });
};

export const loader: LoaderFunction = async () => {
  return redirect('/');
};
