import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server";

export type AuthUserType = {
  id: string;
  name: string;
  email: string;
};

const authenticator = new Authenticator<AuthUserType>(sessionStorage);

const googleStrategy = new GoogleStrategy<AuthUserType>(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.CLIENT_URL}/auth/google/callback`,
  },
  async ({ profile }) => {
    if (profile.emails![0].value !== process.env.AUTHORIZED_EMAIL)
      throw new Error("Invalid email address");

    return {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails![0].value,
    };
  }
);

authenticator.use(googleStrategy);

export { authenticator };
