import {
  type AppLoadContext,
  createCookieSessionStorage,
} from '@remix-run/cloudflare'
import { hc } from 'hono/client'
import { Authenticator } from 'remix-auth'
import { GoogleStrategy } from 'remix-auth-google'
import type { AppType } from 'server'

export type AuthUserType = {
  jwt: string
}

type Env = {
  SESSION_SECRET: string
  NODE_ENV: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  CLIENT_URL: string
  AUTHORIZED_EMAIL: string
  VITE_API_URL: string
}

let _authenticator: Authenticator<AuthUserType> | null = null

export const getAuthenticator = ({ cloudflare }: AppLoadContext) => {
  if (_authenticator) return _authenticator

  const env: Env = cloudflare.env as Env

  _authenticator = new Authenticator<AuthUserType>(
    createCookieSessionStorage({
      cookie: {
        name: '_session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: [env.SESSION_SECRET ?? ''],
        secure: env.NODE_ENV === 'production',
      },
    }),
  )

  _authenticator.use(
    new GoogleStrategy<AuthUserType>(
      {
        clientID: env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: `${env.CLIENT_URL}/auth/google/callback`,
      },
      async ({ profile }) => {
        const client = hc<AppType>(env.VITE_API_URL)
        const res = await client.api.login.$get({
          query: { email: profile.emails[0].value },
        })

        return res.json()
      },
    ),
  )

  return _authenticator
}
