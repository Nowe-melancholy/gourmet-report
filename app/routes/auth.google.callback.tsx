import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  return authenticator.authenticate('google', request, {
    successRedirect: '/success',
    failureRedirect: '/login',
  });
};
