import React from "react";
import { Faktum } from "../faktum/Faktum";
import { IQuizLandFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "./SectionHeading";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";
import { ISpørsmal, useOrkestrator } from "../../context/orkestrator-context";
import { useFeatureToggles } from "../../context/feature-toggle-context";

interface IProps {
  section: IQuizSeksjon;
  readonly?: boolean;
  showAllTexts?: boolean;
}

export function Section(props: IProps) {
  const { getSeksjonTextById } = useSanity();
  const { orkestratorState } = useOrkestrator();
  const { soknadsdialogMedOrkestratorIsEnabled } = useFeatureToggles();
  const sectionTexts = getSeksjonTextById(props.section.beskrivendeId);
  const firstUnansweredFaktum = props.section.fakta.find((faktum) => faktum.svar === undefined);
  const firstUnansweredIndex = props.section.fakta.findIndex(
    (faktum) => faktum.id === firstUnansweredFaktum?.id,
  );

  console.log(`🔥 sectionTexts :`, sectionTexts);
  console.log(`🔥 orkestratorState :`, orkestratorState);
  console.log(`🔥 props.section :`, props.section);

  if (!props.section.beskrivendeId) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  if (soknadsdialogMedOrkestratorIsEnabled) {
    const nesteSporsmal = orkestratorState.nesteSpørsmål;

    const nesteSporsmalToFaktum: QuizFaktum = {
      type: "land",
      grupper: [],
      gyldigeLand: nesteSporsmal.gyldigeSvar,
      id: nesteSporsmal.id,
      beskrivendeId: nesteSporsmal.tekstnøkkel,
      readOnly: false,
    };

    return (
      <>
        <SectionHeading
          text={getSeksjonTextById(orkestratorState.navn.toLowerCase())}
          fallback={orkestratorState.navn.toLowerCase()}
          showAllTexts={props.showAllTexts}
        />

        {orkestratorState.besvarteSpørsmål.map((sporsmal: ISpørsmal) => {
          const sporsmalToFaktum: IQuizLandFaktum = {
            type: "land",
            grupper: [],
            gyldigeLand: sporsmal.gyldigeSvar,
            id: sporsmal.id,
            beskrivendeId: sporsmal.tekstnøkkel,
            readOnly: false,
          };

          return (
            <Faktum
              key={sporsmal.id}
              faktum={sporsmalToFaktum}
              readonly={props.readonly}
              showAllFaktumTexts={props.showAllTexts}
            />
          );
        })}

        <Faktum
          key={orkestratorState.nesteSpørsmål.id}
          faktum={nesteSporsmalToFaktum}
          readonly={props.readonly}
          showAllFaktumTexts={props.showAllTexts}
        />
      </>
    );
  }

  return (
    <>
      <SectionHeading
        text={sectionTexts}
        fallback={props.section.beskrivendeId}
        showAllTexts={props.showAllTexts}
      />
      {props.section?.fakta?.map((faktum, index) => {
        // We should always only show one unanswered faktum at a time. The backend should ideally do it, but that is not always the case
        if (index <= firstUnansweredIndex || firstUnansweredIndex === -1)
          return (
            <Faktum
              key={faktum.beskrivendeId}
              faktum={faktum}
              readonly={props.readonly}
              showAllFaktumTexts={props.showAllTexts}
            />
          );
      })}
    </>
  );
}
