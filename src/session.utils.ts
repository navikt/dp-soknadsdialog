import useSWR from "swr";
import { useRouter } from "next/router";
import api from "./api.utils";
import { useEffect } from "react";

export interface Session extends Record<string, unknown> {
  expires_in?: number;
}

export const useSession = ({
  enforceLogin = true,
  redirectTo = "/api/auth/signin",
  initialSession = undefined,
}): { session: Session | undefined } => {
  const router = useRouter();
  const { data: session, error } = useSWR<Session>(api(`/auth/session`), {
    fallbackData: initialSession,
  });

  useEffect(() => {
    const isLoading = !session && !error;

    // Waiting for data
    if (isLoading) {
      // eslint-disable-next-line no-console
      console.log("waiting");
      return;
    }

    // Got data and should redirect if no session
    if (enforceLogin && redirectTo && !session?.expires_in) {
      router.push(redirectTo);
    }
    // eslint-disable-next-line no-console
    console.log("useeffect triggered! " + session);
  }, [session, error, enforceLogin, redirectTo, router]);

  if (
    // No active session, and should redirect
    (enforceLogin && redirectTo && !session?.expires_in) ||
    // No active session, and should not redirect
    (!enforceLogin && !session?.expires_in)
  ) {
    // eslint-disable-next-line no-console
    console.log("no active session!");
    // eslint-disable-next-line no-console
    console.log(enforceLogin, redirectTo, session);
    return { session: undefined };
  }
  return { session };
};
