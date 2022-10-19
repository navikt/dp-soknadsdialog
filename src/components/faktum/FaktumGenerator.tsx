import { QuizFaktum, IQuizGeneratorFaktum } from "../../types/quiz.types";
import {
  ARBEIDSFORHOLD_FAKTUM_ID,
  BARN_LISTE_FAKTUM_ID,
  BARN_LISTE_REGISTER_FAKTUM_ID,
} from "../../constants";
import React, { useEffect } from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { Faktum, IFaktum } from "./Faktum";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barn } from "../barn/Barn";
import { useSanity } from "../../context/sanity-context";
import { BarnRegister } from "../barn/BarnRegister";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { FetchIndicator } from "../FetchIndicator";
import { useQuiz } from "../../context/quiz-context";
import { useValidation } from "../../context/validation-context";
import { ValidationMessage } from "./validation/ValidationMessage";

export function FaktumGenerator(props: IFaktum<IQuizGeneratorFaktum>) {
  switch (props.faktum.beskrivendeId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...props} />;
    case BARN_LISTE_REGISTER_FAKTUM_ID:
      return <BarnRegister {...props} />;
    case BARN_LISTE_FAKTUM_ID:
      return <Barn {...props} />;
    default:
      return <StandardGenerator {...props} />;
  }
}

function StandardGenerator(props: IFaktum<IQuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { isLoading } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();

  // Set active index to open modal when adding a new answer. Quiz returns an array with 1 faktum after adding a new answer.
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
      {props.faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        const shouldShowValidationMessage = fakta.some(
          (faktum: QuizFaktum) => faktum.id === unansweredFaktumId
        );

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(props.faktum, svarIndex)}
              readOnly={!!props.faktum}
              showValidationMessage={shouldShowValidationMessage}
            >
              <Heading level={"3"} size={"small"}>
                {getStandardTitle(fakta, svarIndex)}
              </Heading>
            </GeneratorFaktumCard>

            <Modal
              closeButton={false}
              shouldCloseOnOverlayClick={false}
              className="modal-container modal-container--generator"
              open={activeIndex === svarIndex}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                {fakta.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                <FetchIndicator isLoading={isLoading} />

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
          {getAppText("soknad.generator-faktum.knapp.legg-til")}
        </Button>
      )}

      {unansweredFaktumId === props.faktum.id && (
        <ValidationMessage message={getAppText("validering.faktum.ubesvart")} />
      )}
    </>
  );
}

function getStandardTitle(fakta: QuizFaktum[], index: number): string {
  const fallback = `Svar ${index}`;
  const title = fakta[0]?.svar;

  switch (typeof title) {
    case "string":
      return title;
    case "number":
      return title.toString();
    default:
      return fallback;
  }
}
