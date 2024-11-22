import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  console.log("&&&&&&&&&&&&", {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.CLIENT_URL}/auth/google/callback`,
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  });
  return authenticator.authenticate("google", request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
