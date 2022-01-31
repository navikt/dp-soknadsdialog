import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { Session } from "@navikt/dp-auth/dist/server";
import merge from "lodash/merge";

export type SessionProps = {
  session?: Session;
};

export type Options = {
  enforceLogin: boolean;
};

export function ensureAuth({ enforceLogin }: Options) {
  return (getServerSideProps: GetServerSideProps): GetServerSideProps => {
    if (!enforceLogin) return getServerSideProps;

    return _ensureAuth(getServerSideProps);
  };
}

function _ensureAuth<P>(getServerSideProps?: GetServerSideProps): GetServerSideProps {
  return async (ctx): Promise<SessionProps & GetServerSidePropsResult<P>> => {
    const { token, payload } = await getSession(ctx);
    if (!token) {
      return {
        redirect: {
          destination: `/api/auth/signin?destination=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    // @ts-ignore TODO Fix typene her
    const expires_in = Math.round(payload.exp - Date.now() / 1000);
    const childProps = getServerSideProps ? await getServerSideProps(ctx) : {};
    // @ts-ignore TODO Fix typene her
    return merge({}, childProps, {
      props: {
        session: {
          expires_in,
        },
      },
    });
  };
}
