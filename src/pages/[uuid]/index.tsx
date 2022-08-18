import React from "react";
import { Soknad } from "../../views/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { ISanityTexts } from "../../types/sanity.types";
import { audience } from "../../api.utils";
import { getSoknadState } from "../../server-side/quiz-api";
import { IQuizState } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import Error from "../_error";

interface ISoknadMedIdParams {
  soknadState: IQuizState | undefined;
  sanityTexts: ISanityTexts;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ISoknadMedIdParams>> {
  const { token, apiToken } = await getSession(context);
  const { query, locale } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
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
    },
  };
}

export default function SoknadMedId(props: ISoknadMedIdParams) {
  if (!props.sanityTexts.seksjoner) {
    return (
      <Error
        title="Beklager, det skjedde en teknisk feil."
        details="Noe gikk galt ved henting av texter fra sanity"
        statusCode={500}
      />
    );
  }

  if (!props.soknadState) {
    return (
      <Error
        title="Beklager, det skjedde en teknisk feil."
        details="Noe gikk galt ved data fra Quiz"
        statusCode={500}
      />
    );
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Soknad />
      </QuizProvider>
    </SanityProvider>
  );
}
