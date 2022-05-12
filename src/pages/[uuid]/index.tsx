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
import { QuizState } from "../../localhost-data/quiz-state-response";
import { SanityTexts } from "../../types/sanity.types";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SoknadMedIdParams>> {
  const { query } = context;
  const uuid = query.uuid as string;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTexts);

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
    props: {
      reduxState: initialState,
      soknadState: soknadState ? soknadState : undefined,
      sanityTexts,
    },
  };
}

interface SoknadMedIdParams {
  reduxState: RootState;
  soknadState: QuizState | undefined;
  sanityTexts: SanityTexts;
}

export default function SoknadMedId(props: SoknadMedIdParams) {
  const reduxStore = initialiseStore(props.reduxState);

  // eslint-disable-next-line no-console
  console.log(props.soknadState);

  if (!props.soknadState) {
    return <div>Noe gikk galt ved henting av soknad state fra quiz</div>;
  }

  return (
    <Provider store={reduxStore}>
      <SanityContext.Provider value={props.sanityTexts}>
        <Soknad soknadState={props.soknadState} sanityTexts={props.sanityTexts} />
      </SanityContext.Provider>
    </Provider>
  );
}

export const SanityContext = React.createContext<SanityTexts | null>(null);
