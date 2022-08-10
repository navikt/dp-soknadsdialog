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
import ErrorPage from "../_error";

interface SoknadMedIdParams {
  soknadState: QuizState | undefined;
  sanityTexts: SanityTexts;
  sanityTextsError: number | null;
  soknadStatError: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SoknadMedIdParams>> {
  const { token, apiToken } = await getSession(context);
  const { query, locale } = context;
  const uuid = query.uuid as string;
  const sanityTextsError = null;
  const soknadStatError = null;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });
  let soknadState;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadState = await getSoknadState(uuid, "", { firstRender: true });
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
      sanityTextsError,
      soknadStatError,
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

  if (props.sanityTextsError) {
    return <ErrorPage statusCode={props.sanityTextsError} />;
  }

  if (props.soknadStatError) {
    return <ErrorPage statusCode={props.soknadStatError} />;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Soknad />
      </QuizProvider>
    </SanityProvider>
  );
}
