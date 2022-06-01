import React from "react";
import { Soknad } from "../../views/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { SanityTexts } from "../../types/sanity.types";
import { audience } from "../../api.utils";
import { getSoknadState } from "../../server-side/quiz-api";
import { QuizState } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import { Alert } from "@navikt/ds-react";

interface SoknadMedIdParams {
  soknadState: QuizState | undefined;
  sanityTexts: SanityTexts;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SoknadMedIdParams>> {
  const { token, apiToken } = await getSession(context);
  const { query, locale } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });
  let soknadState;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadState = await getSoknadState(uuid, "", true);
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadState = await getSoknadState(uuid, onBehalfOfToken);

    // eslint-disable-next-line no-console
    console.log("ServerSideProps SoknadState", soknadState);
  }
  return {
    props: {
      sanityTexts,
      soknadState,
    },
  };
}

export default function SoknadMedId(props: SoknadMedIdParams) {
  if (!props.sanityTexts.seksjoner) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  if (!props.soknadState) {
    return <Alert variant="error">Quiz er ducked</Alert>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Soknad />
      </QuizProvider>
    </SanityProvider>
  );
}
