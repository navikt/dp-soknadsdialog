import { GetServerSidePropsContext } from "next";
import React from "react";
import ErrorPage from "./_error";
import { createInnsendingUuid } from "./api/quiz-api";
import { audienceDPSoknad } from "../api.utils";
import { getSession } from "../auth.utils";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      redirect: {
        destination: `./uuid-innsending/`,
        permanent: false,
      },
    };
  }

  const { token, apiToken } = await getSession(context.req);
  if (!token || !apiToken) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const innsendingUuidResponse = await createInnsendingUuid(onBehalfOfToken);

  if (innsendingUuidResponse.ok) {
    const innsendingUuid = await innsendingUuidResponse.text();

    if (innsendingUuid) {
      return {
        redirect: {
          destination: `./${innsendingUuid}/`,
          permanent: false,
        },
      };
    }
  }
}

export default function Innsending() {
  // If everything went okay the user will be redirected. Return therefore error directly.
  return (
    <ErrorPage
      title="Vi har tekniske problemer"
      details="Beklager, vi får ikke kontakt med systemene våre akkurat nå. Svarene dine er lagret og du kan prøve igjen om litt."
    />
  );
}
