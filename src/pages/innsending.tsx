import { GetServerSidePropsContext } from "next";
import React from "react";
import ErrorPage from "./_error";
import { startSoknad } from "./api/quiz-api";
import { getSession } from "@navikt/dp-auth/server";
import { audienceDPSoknad } from "../api.utils";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      redirect: {
        destination: `./uuid-innsending/`,
        permanent: false,
      },
    };
  }

  const { token, apiToken } = await getSession(context);
  if (!token || !apiToken) {
    // TODO Redirect til hvilken login?
    return {
      redirect: {
        destination: "/oauth2/login",
        permanent: false,
      },
    };
  }

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const soknadResponse = await startSoknad(onBehalfOfToken, "Innsending");

  if (soknadResponse.ok) {
    const soknadId = await soknadResponse.text();

    if (soknadId) {
      return {
        redirect: {
          destination: `./${soknadId}/`,
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
