import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { ISanityTexts } from "../../types/sanity.types";
import { audience } from "../../api.utils";
import { getSoknadState } from "../../api/server/quiz-api";
import { IQuizState } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import { Alert } from "@navikt/ds-react";
import { Receipt } from "../../views/Receipt";

interface IProps {
  soknadState: IQuizState | undefined;
  sanityTexts: ISanityTexts;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { token, apiToken } = await getSession(context);
  const { query, locale } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  let soknadState;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadState = await getSoknadState(uuid, "", null, { summary: true });
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadState = await getSoknadState(uuid, onBehalfOfToken);
  }
  return {
    props: {
      sanityTexts,
      soknadState,
    },
  };
}

export default function ReceiptPage(props: IProps) {
  if (!props.sanityTexts.seksjoner) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  if (!props.soknadState) {
    return <Alert variant="error">Quiz er ducked</Alert>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Receipt />
      </QuizProvider>
    </SanityProvider>
  );
}
