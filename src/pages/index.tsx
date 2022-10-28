import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import { StartSoknad } from "../views/start-soknad/StartSoknad";
import { getSession } from "../auth.utils";

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

  return {
    props: {},
  };
}

export default function Soknad() {
  return <StartSoknad />;
}
