import React from "react";
import { Soknad } from "../../views/Soknad";
import { GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTexts } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { SanityTexts } from "../../types/sanity.types";

export async function getServerSideProps(): Promise<GetServerSidePropsResult<SanityTexts>> {
  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTexts);

  return {
    props: {
      ...sanityTexts,
    },
  };
}

export default function SoknadMedId(props: SanityTexts) {
  if (!props.seksjoner) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  return (
    <SanityContext.Provider value={props}>
      <QuizProvider>
        <Soknad />
      </QuizProvider>
    </SanityContext.Provider>
  );
}

export const SanityContext = React.createContext<SanityTexts | null>(null);
