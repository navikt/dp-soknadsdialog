import React, { useEffect } from "react";
import { BodyShort, Button, Detail, Heading, Label, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import {
  QuizFaktum,
  IQuizGeneratorFaktum,
  IQuizPeriodeFaktumAnswerType,
} from "../../types/quiz.types";
import { Faktum, IFaktum } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { FetchIndicator } from "../fetch-indicator/FetchIndicator";
import { useQuiz } from "../../context/quiz-context";
import { BriefcaseAdd } from "../../svg-icons/BriefcaseAdd";
import { PortableText } from "@portabletext/react";
import { FormattedDate } from "../FormattedDate";
import { findEmployerName } from "../../faktum.utils";
import { useValidation } from "../../context/validation-context";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";

export function Arbeidsforhold(props: IFaktum<IQuizGeneratorFaktum>) {
  const { faktum } = props;
  const { isLoading } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText, getSvaralternativTextById, getFaktumTextById } = useSanity();
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  // Set active index to open modal when adding a new arbeidsforhold. Quiz returns an array with 1 faktum after adding a new arbeidsforhold.
  useEffect(() => {
    if (faktum?.svar) {
      const lastGeneratorAnswerIndex = faktum.svar.length - 1;
      const lastGeneratorAnswer = faktum.svar[lastGeneratorAnswerIndex];

      if (lastGeneratorAnswer?.length === 1 && !lastGeneratorAnswer[0].svar) {
        toggleActiveGeneratorAnswer(lastGeneratorAnswerIndex);
      }
    }
  }, [faktum?.svar?.length]);

  return (
    <>
      <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}

      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        const shouldShowValidationMessage = fakta.some(
          (faktum: QuizFaktum) => faktum.id === unansweredFaktumId
        );

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
              readOnly={props.readonly}
              showValidationMessage={shouldShowValidationMessage}
            >
              <Heading level={"3"} size={"small"} spacing>
                {getArbeidsforholdName(fakta)}
              </Heading>

              <BodyShort>{getArbeidsforholdVarighet(fakta)}</BodyShort>

              <Detail uppercase spacing>
                <>{getSvaralternativTextById(getArbeidsforholdEndret(fakta))?.text}</>
              </Detail>
            </GeneratorFaktumCard>

            <Modal
              className="modal-container modal-container--generator"
              open={activeIndex === svarIndex}
              shouldCloseOnOverlayClick={false}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                <Heading size={"large"} spacing>
                  {getAppText("arbeidsforhold.knapp.legg-til")}{" "}
                </Heading>
                {fakta.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                <FetchIndicator isLoading={isLoading} />

                <div className={"modal-container__button-container"}>
                  <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                    {getAppText("soknad.generator.lagre-og-lukk-knapp")}
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => deleteGeneratorAnswer(faktum, svarIndex)}
                  >
                    {getAppText("soknad.generator.slett-knapp")}
                  </Button>
                </div>
              </Modal.Content>
            </Modal>
          </div>
        );
      })}

      {!props.readonly && (
        <>
          <Button
            variant="secondary"
            className={"generator-faktum__add-button"}
            onClick={() => addNewGeneratorAnswer(faktum)}
            icon={<BriefcaseAdd />}
          >
            {getAppText("arbeidsforhold.knapp.legg-til")}
          </Button>
          {unansweredFaktumId === faktum.id && (
            <ValidationMessage message={getAppText("validering.faktum.ubesvart")} />
          )}
        </>
      )}
    </>
  );
}

export function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return findEmployerName(arbeidsforhold) ?? "Fant ikke navn på arbeidsgiver";
}

export function getArbeidsforholdVarighet(arbeidsforhold: QuizFaktum[]) {
  const varighetFaktum = arbeidsforhold.find(
    (answer) => answer.beskrivendeId === "faktum.arbeidsforhold.varighet"
  )?.svar as IQuizPeriodeFaktumAnswerType;
  if (!varighetFaktum) return <></>;

  return (
    <>
      <FormattedDate date={varighetFaktum.fom} />
      {varighetFaktum.tom && (
        <>
          {`- `}
          <FormattedDate date={varighetFaktum.tom} />
        </>
      )}
    </>
  );
}

export function getArbeidsforholdEndret(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.endret")
      ?.svar as string) ?? "Fant ikke årsak"
  );
}
