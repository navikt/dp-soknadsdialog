import React from "react";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { useSanity } from "../../context/sanity-context";
import { useQuiz } from "../../context/quiz-context";

export function Pdf() {
  const { getAppText } = useSanity();
  const { soknadState } = useQuiz();

  return (
    <>
      <PageMeta
        title={getAppText("soknad.side-metadata.tittel")}
        description={getAppText("soknad.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <main>
        {soknadState.seksjoner.map((section) => (
          <Section key={section.beskrivendeId} section={section} readonly={true} />
        ))}
      </main>
    </>
  );
}
