import React from "react";
import { Provider } from "react-redux";
import { initialiseStore, RootState } from "../../store";
import { Soknad } from "../../views/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTexts } from "../../sanity/groq-queries";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../api.utils";
import { getFakta } from "../../server-side/quiz-api";
import { mapQuizFaktaToReduxState } from "../../server-side/quiz-to-redux-mapper";
import { TypedObject } from "@portabletext/types";

interface SanityHelpText {
  title: string;
  body: TypedObject | TypedObject[];
}

interface SanityAlertText {
  title: string;
  type: "info" | "warning" | "error" | "success";
  body: TypedObject | TypedObject[];
}

interface SanityFaktum {
  textId: string;
  text: string;
  description: TypedObject | TypedObject[];
  helpText: SanityHelpText;
  unit: string;
}

interface SanitySeksjon {
  textId: string;
  title: string;
  description: TypedObject | TypedObject[];
  helpText: SanityHelpText;
}

interface SanitySvarAlternativ {
  textId: string;
  text: string;
  alertText: SanityAlertText;
}
interface SanityTexts {
  fakta: SanityFaktum[];
  seksjoner: SanitySeksjon[];
  svaralternativer: SanitySvarAlternativ[];
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<RootState>> {
  const { query } = context;
  const uuid = query.uuid as string;

  const allSanityTexts = await sanityClient.fetch<SanityTexts>(allTexts);
  // eslint-disable-next-line
  console.log(allSanityTexts);

  const { token, apiToken } = await getSession(context);
  let initialState: RootState = {
    soknadId: uuid,
    sectionsState: {
      sections: [],
      currentSectionIndex: 0,
      sectionFaktumIndex: 0,
    },
    answers: [],
    generators: [],
    quizFakta: [],
  };

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const quizFakta = await getFakta(uuid, "");
    initialState = { ...initialState, ...mapQuizFaktaToReduxState(quizFakta), quizFakta };
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const quizFakta = await getFakta(uuid, onBehalfOfToken);
    initialState = { ...initialState, ...mapQuizFaktaToReduxState(quizFakta), quizFakta };
  }

  return {
    props: { ...initialState },
  };
}

export default function SoknadMedId(props: RootState) {
  const reduxStore = initialiseStore(props);

  return (
    <Provider store={reduxStore}>
      <Soknad />
    </Provider>
  );
}
