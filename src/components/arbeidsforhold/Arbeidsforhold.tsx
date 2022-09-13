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
import { FetchIndicator } from "../FetchIndicator";
import { useQuiz } from "../../context/quiz-context";
import { BriefcaseAdd } from "../../svg-icons/BriefcaseAdd";
import { PortableText } from "@portabletext/react";
import { ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID } from "../../constants";
import { parseDateFromIso } from "../../date.utils";

export function Arbeidsforhold(props: IFaktum<IQuizGeneratorFaktum>) {
  const { faktum } = props;
  const { isLoading } = useQuiz();
  const { getAppTekst, getSvaralternativTextById, getFaktumTextById } = useSanity();
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
  }, [faktum?.svar]);

  return (
    <>
      <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}

      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
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
              className={"modal-container"}
              open={activeIndex === svarIndex}
              shouldCloseOnOverlayClick={false}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                <Heading size={"large"} spacing>
                  {getAppTekst("arbeidsforhold.legg-til")}{" "}
                </Heading>
                {fakta.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                <FetchIndicator isLoading={isLoading} />

                <div className={"modal-container__button-container"}>
                  <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                    Lagre og lukk
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => deleteGeneratorAnswer(faktum, svarIndex)}
                  >
                    Slett
                  </Button>
                </div>
              </Modal.Content>
            </Modal>
          </div>
        );
      })}

      {!props.readonly && (
        <Button
          variant="secondary"
          className={"generator-faktum__add-button"}
          onClick={() => addNewGeneratorAnswer(faktum)}
          icon={<BriefcaseAdd />}
        >
          {getAppTekst("arbeidsforhold.legg-til")}
        </Button>
      )}
    </>
  );
}

export function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID)
      ?.svar as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}

export function getArbeidsforholdVarighet(arbeidsforhold: QuizFaktum[]): string {
  const varighetFaktum = arbeidsforhold.find(
    (answer) => answer.beskrivendeId === "faktum.arbeidsforhold.varighet"
  )?.svar as IQuizPeriodeFaktumAnswerType;
  if (!varighetFaktum) return "Fant ikke periode";
  const parsedFom = parseDateFromIso(varighetFaktum.fom);
  const parsedTom = varighetFaktum.tom ? `- ${parseDateFromIso(varighetFaktum.tom)}` : "";
  return `${parsedFom} ${parsedTom}`;
}

export function getArbeidsforholdEndret(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.endret")
      ?.svar as string) ?? "Fant ikke årsak"
  );
}
