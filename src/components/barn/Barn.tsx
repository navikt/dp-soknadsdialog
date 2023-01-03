import React, { useEffect } from "react";
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import { Faktum, IFaktum } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { FetchIndicator } from "../fetch-indicator/FetchIndicator";
import { useQuiz } from "../../context/quiz-context";
import { getChildBirthDate } from "./BarnRegister";
import { ChildAdd } from "../../svg-icons/ChildAdd";
import { useValidation } from "../../context/validation-context";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { BarnNavn } from "./BarnNavn";
import { BarnBostedsland } from "./BarnBodstedsland";

export function Barn(props: IFaktum<IQuizGeneratorFaktum>) {
  const { faktum } = props;
  const { isLoading } = useQuiz();
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  // Set active index to open modal when adding a new child. Quiz returns an array with 1 faktum after adding a new child.
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
      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        const shouldShowValidationMessage = fakta.some(
          (faktum: QuizFaktum) => faktum.id === unansweredFaktumId
        );

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              generatorFaktumType="barn"
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
              readOnly={props.readonly}
              showValidationMessage={shouldShowValidationMessage}
            >
              <Heading level={"3"} size={"small"}>
                <BarnNavn barn={fakta} />
              </Heading>
              <BodyShort>{getChildBirthDate(fakta)}</BodyShort>
              <Detail uppercase spacing>
                <BarnBostedsland barn={fakta} />
              </Detail>
            </GeneratorFaktumCard>
            <Modal
              className="modal-container modal-container--generator"
              open={activeIndex === svarIndex}
              shouldCloseOnOverlayClick={false}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                {fakta.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                <FetchIndicator isLoading={isLoading} />

                <div className={"modal-container__button-container"}>
                  <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                    {getAppText("soknad.generator.lagre-og-lukk-knapp")}
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
            icon={<ChildAdd />}
          >
            {getAppText("barn.knapp.legg-til")}
          </Button>
          {unansweredFaktumId === faktum.id && (
            <ValidationMessage message={getAppText("validering.faktum.ubesvart")} />
          )}
        </>
      )}
    </>
  );
}
