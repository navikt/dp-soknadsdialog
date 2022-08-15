import React from "react";
import { Documentation } from "../../views/Documentation";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { SanityTexts } from "../../types/sanity.types";
import { audience } from "../../api.utils";
import { getSoknadState } from "../../server-side/quiz-api";
import { getDocumentationList } from "../../server-side/documentation-api";
import { QuizState } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import { Alert } from "@navikt/ds-react";
import { DokumentkravListe } from "../../types/documentation.types";

interface Props {
  soknadState: QuizState | undefined;
  sanityTexts: SanityTexts;
  documents: DokumentkravListe | undefined;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const { token, apiToken } = await getSession(context);
  const { query, locale } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  let soknadState;
  let documents;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadState = await getSoknadState(uuid, "", { summary: true });
    documents = await getDocumentationList(uuid, "1234");
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadState = await getSoknadState(uuid, onBehalfOfToken);
    documents = await getDocumentationList(uuid, onBehalfOfToken);
  }
  return {
    props: {
      soknadState,
      sanityTexts,
      documents,
    },
  };
}

export default function DocumentPage(props: Props) {
  if (!props.sanityTexts.seksjoner) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  if (!props.soknadState) {
    return <Alert variant="error">Quiz er ducked</Alert>;
  }

  if (!props.documents) {
    return <Alert variant="info">Ingen dokumentasjonskrav tilgjengelig på søknaden</Alert>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Documentation documents={props.documents} />
      </QuizProvider>
    </SanityProvider>
  );
}
