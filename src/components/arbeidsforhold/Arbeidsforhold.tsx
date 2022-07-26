import React, { useEffect } from "react";
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import {
  QuizFaktum,
  QuizGeneratorFaktum,
  QuizPeriodeFaktumAnswerType,
} from "../../types/quiz.types";
import { Faktum, FaktumProps } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { PingLoader } from "../PingLoader";
import { useQuiz } from "../../context/quiz-context";

export function Arbeidsforhold(props: FaktumProps<QuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { isLoading } = useQuiz();
  const { getAppTekst, getSvaralternativTextById } = useSanity();

  // Set active index to open modal when adding a new arbeidsforhold. Quiz returns an array with 1 faktum after adding a new arbeidsforhold.
  useEffect(() => {
    if (props.faktum?.svar) {
      const lastGeneratorAnswerIndex = props.faktum.svar.length - 1;
      const lastGeneratorAnswer = props.faktum.svar[lastGeneratorAnswerIndex];

      if (lastGeneratorAnswer?.length === 1 && !lastGeneratorAnswer[0].svar) {
        toggleActiveGeneratorAnswer(lastGeneratorAnswerIndex);
      }
    }
  }, [props.faktum?.svar]);

  return (
    <>
      {props.faktum?.svar?.map((faktum, svarIndex) => {
        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              fakta={faktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(props.faktum, svarIndex)}
            >
              <Heading level={"3"} size={"small"}>
                {getArbeidsforholdName(faktum)}
              </Heading>

              <BodyShort>{getArbeidsforholdVarighet(faktum)}</BodyShort>

              <Detail uppercase>
                <>{getSvaralternativTextById(getArbeidsforholdEndret(faktum))?.text}</>
              </Detail>
            </GeneratorFaktumCard>

            <Modal
              closeButton={false}
              shouldCloseOnOverlayClick={false}
              open={activeIndex === svarIndex}
              className={"modal-container"}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                <Heading size={"large"} spacing>
                  {getAppTekst("arbeidsforhold.legg-til")}{" "}
                </Heading>
                {faktum.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                {isLoading && (
                  <div>
                    <PingLoader />
                  </div>
                )}

                <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                  Lagre og lukk
                </Button>
              </Modal.Content>
            </Modal>
          </div>
        );
      })}

      {!props.readonly && (
        <Button variant="secondary" onClick={() => addNewGeneratorAnswer(props.faktum)}>
          {getAppTekst("arbeidsforhold.legg-til")}
        </Button>
      )}
    </>
  );
}

export function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift")
      ?.svar as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}

export function getArbeidsforholdVarighet(arbeidsforhold: QuizFaktum[]): string {
  const varighetFaktum = arbeidsforhold.find(
    (answer) => answer.beskrivendeId === "faktum.arbeidsforhold.varighet"
  )?.svar as QuizPeriodeFaktumAnswerType;
  if (!varighetFaktum) return "Fant ikke periode";
  return `${varighetFaktum.fom} - ${varighetFaktum.tom}`;
}

export function getArbeidsforholdEndret(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.endret")
      ?.svar as string) ?? "Fant ikke årsak"
  );
}
