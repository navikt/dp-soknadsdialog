import React from "react";
import { Faktum } from "../faktum/Faktum";
import { IQuizSeksjon } from "../../types/quiz.types";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "./SectionHeading";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";

interface IProps {
  section: IQuizSeksjon;
  readonly?: boolean;
  showAllTexts?: boolean;
}

export function Section(props: IProps) {
  const { getSeksjonTextById } = useSanity();
  const sectionTexts = getSeksjonTextById(props.section.beskrivendeId);

  if (!props.section.beskrivendeId) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  return (
    <>
      <SectionHeading
        text={sectionTexts}
        fallback={props.section.beskrivendeId}
        showAllTexts={props.showAllTexts}
      />

      {props.section?.fakta?.map((faktum) => (
        <Faktum
          key={faktum.beskrivendeId}
          faktum={faktum}
          readonly={props.readonly}
          showAllFaktumTexts={props.showAllTexts}
        />
      ))}
    </>
  );
}
