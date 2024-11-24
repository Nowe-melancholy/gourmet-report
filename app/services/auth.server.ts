import { Authenticator } from 'remix-auth';
import { GoogleStrategy } from 'remix-auth-google';
import {
  AppLoadContext,
  createCookieSessionStorage,
} from '@remix-run/cloudflare';

export type AuthUserType = {
  id: string;
  name: string;
  email: string;
};

type Env = {
  SESSION_SECRET: string;
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  CLIENT_URL: string;
  AUTHORIZED_EMAIL: string;
};

let _authenticator: Authenticator<AuthUserType> | null = null;

export const getAuthenticator = ({ cloudflare }: AppLoadContext) => {
  if (_authenticator) return _authenticator;

  const env: Env = (
    typeof cloudflare.env === 'object' ? cloudflare.env : process.env
  ) as Env;

  _authenticator = new Authenticator<AuthUserType>(
    createCookieSessionStorage({
      cookie: {
        name: '_session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: [env.SESSION_SECRET!],
        secure: env.NODE_ENV === 'production',
      },
    })
  );

  _authenticator.use(
    new GoogleStrategy<AuthUserType>(
      {
        clientID: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${env.CLIENT_URL}/auth/google/callback`,
      },
      async ({ profile }) => {
        if (profile.emails![0].value !== env.AUTHORIZED_EMAIL)
          throw new Error('Invalid email address');

        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails![0].value,
        };
      }
    )
  );

  return _authenticator;
};
