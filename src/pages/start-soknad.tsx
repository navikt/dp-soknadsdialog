import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import { StartSoknad } from "../views/start-soknad/StartSoknad";
import { getSession } from "../auth.utils";
import { audienceDPSoknad } from "../api.utils";
import { getMineSoknader } from "./api/soknad/get-mine-soknader";
import { IMineSoknader } from "../types/quiz.types";
import { logFetchError } from "../sentry.logger";
import { GET_MINE_SOKNADER_ERROR } from "../sentry-constants";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<object>> {
  const { locale } = context;

  const session = await getSession(context.req);
  if (!session) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {},
    };
  }

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);

  if (mineSoknaderResponse.ok) {
    const mineSoknader: IMineSoknader = await mineSoknaderResponse.json();

    if (mineSoknader?.paabegynt) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    logFetchError(GET_MINE_SOKNADER_ERROR);
  }

  return {
    props: {},
  };
}

export default function Soknad() {
  return <StartSoknad />;
}
