import React from "react";
import { Provider } from "react-redux";
import { initialiseStore, RootState } from "../../store";
import { Soknad } from "../../views/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTexts } from "../../sanity/groq-queries";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../api.utils";
import { getSoknadState } from "../../server-side/quiz-api";
import { TypedObject } from "@portabletext/types";
import { QuizState } from "../../localhost-data/quiz-state-response";

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
): Promise<GetServerSidePropsResult<SoknadMedIdParams>> {
  const { query } = context;
  const uuid = query.uuid as string;

  const allSanityTexts = await sanityClient.fetch<SanityTexts>(allTexts);
  // eslint-disable-next-line
  console.log(allSanityTexts);

  const { token, apiToken } = await getSession(context);
  const initialState: RootState = {
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

  let soknadState;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadState = await getSoknadState(uuid, "");
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadState = await getSoknadState(uuid, onBehalfOfToken);
  }

  return {
    props: { reduxState: initialState, soknadState },
  };
}

interface SoknadMedIdParams {
  reduxState: RootState;
  soknadState: QuizState | undefined;
}

export default function SoknadMedId(props: SoknadMedIdParams) {
  const reduxStore = initialiseStore(props.reduxState);

  // eslint-disable-next-line no-console
  console.log(props.soknadState);

  return (
    <Provider store={reduxStore}>
      <Soknad />
    </Provider>
  );
}
