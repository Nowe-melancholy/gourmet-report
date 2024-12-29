import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
} from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { getAuthenticator } from '~/services/auth.server'

export const action: ActionFunction = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context)

  if (await authenticator.isAuthenticated(request))
    return redirect('/admin/top')

  return getAuthenticator(context).authenticate('google', request)
}

export const loader: LoaderFunction = async () => {
  return redirect('/')
}
