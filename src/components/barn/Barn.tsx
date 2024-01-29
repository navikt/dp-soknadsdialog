import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { forwardRef, Ref, useEffect } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { ChildAdd } from "../../svg-icons/ChildAdd";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import { Faktum, IFaktum } from "../faktum/Faktum";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { FetchIndicator } from "../fetch-indicator/FetchIndicator";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { BarnBostedsland } from "./BarnBodstedsland";
import { BarnNavn } from "./BarnNavn";
import { getChildBirthDate } from "./BarnRegister";

export const Barn = forwardRef(BarnComponent);

function BarnComponent(props: IFaktum<IQuizGeneratorFaktum>, ref: Ref<HTMLDivElement> | undefined) {
  const { faktum } = props;
  const { isLoading } = useQuiz();
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();

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
    <div ref={ref} aria-invalid={unansweredFaktumId === faktum.id} tabIndex={-1}>
      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        const shouldShowValidationMessage = fakta.some(
          (faktum: QuizFaktum) => faktum.id === unansweredFaktumId,
        );

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              generatorFaktumType="barn"
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
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
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Header closeButton className="modal-container__custom-header" />
              <Modal.Body>
                {fakta.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                <FetchIndicator isLoading={isLoading} />

                <div className={"modal-container__button-container"}>
                  <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                    {getAppText("soknad.generator.lagre-og-lukk-knapp")}
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        );
      })}

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
    </div>
  );
}
