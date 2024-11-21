import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
} from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { authenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  return authenticator.authenticate('google', request);
};

export const loader: LoaderFunction = async () => {
  return redirect('/');
};
