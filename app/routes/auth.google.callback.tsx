import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({
  request,
  context,
}: LoaderFunctionArgs) => {
  return getAuthenticator(context).authenticate('google', request, {
    successRedirect: '/admin/top',
    failureRedirect: '/',
  });
};
