import React from "react";
import { Soknad } from "../../views/soknad/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { ISanityTexts } from "../../types/sanity.types";
import { audienceDPSoknad } from "../../api.utils";
import { getSoknadState } from "../api/quiz-api";
import { IQuizState, quizStateResponse } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import ErrorPage from "../_error";
import { IPersonalia } from "../../types/personalia.types";
import { mockPersonalia } from "../../localhost-data/personalia";
import { getPersonalia } from "../../api/personalia-api";

interface IProps {
  sanityTexts: ISanityTexts;
  soknadState: IQuizState | null;
  personalia: IPersonalia;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        sanityTexts,
        soknadState: quizStateResponse,
        personalia: mockPersonalia,
        errorCode: null,
      },
    };
  }

  const { token, apiToken } = await getSession(context);
  if (!token || !apiToken) {
    // TODO Redirect til hvilken login?
    return {
      redirect: {
        destination: "/TODO-redoratoren-login",
        permanent: false,
      },
    };
  }

  let errorCode = null;
  let soknadState = null;
  let personalia;

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  const personaliaResponse = await getPersonalia();

  if (!personaliaResponse.ok) {
    errorCode = personaliaResponse.status;
  } else {
    personalia = await personaliaResponse.json();
  }

  return {
    props: {
      sanityTexts,
      soknadState,
      personalia,
      errorCode,
    },
  };
}

export default function SoknadPage(props: IProps) {
  if (props.errorCode || !props.soknadState) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode || 500}
      />
    );
  }

  if (!props.sanityTexts.seksjoner) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={500}
      />
    );
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Soknad personalia={props.personalia} />
      </QuizProvider>
    </SanityProvider>
  );
}
