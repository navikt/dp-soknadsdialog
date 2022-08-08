import React, { useEffect } from "react";
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { QuizGeneratorFaktum } from "../../types/quiz.types";
import { Faktum, FaktumProps } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { PingLoader } from "../PingLoader";
import { useQuiz } from "../../context/quiz-context";
import { useRouter } from "next/router";
import { getChildBirthDate, getChildBostedsland, getChildName } from "./BarnRegister";
import { ChildAdd } from "../../svg-icons/ChildAdd";

export function Barn(props: FaktumProps<QuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { getAppTekst } = useSanity();
  const { isLoading } = useQuiz();
  const { locale } = useRouter();

  // Set active index to open modal when adding a new child. Quiz returns an array with 1 faktum after adding a new child.
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
        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(props.faktum, svarIndex)}
            >
              <Heading level={"3"} size={"small"}>
                {getChildName(fakta)}
              </Heading>

              <BodyShort>{getChildBirthDate(fakta)}</BodyShort>

              <Detail uppercase spacing>
                <>{getChildBostedsland(fakta, locale)}</>
              </Detail>
            </GeneratorFaktumCard>

            <Modal
              className={"modal-container"}
              open={activeIndex === svarIndex}
              shouldCloseOnOverlayClick={false}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                {fakta.map((faktum) => (
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
        <Button
          variant="secondary"
          className={"generator-faktum__add-button"}
          onClick={() => addNewGeneratorAnswer(props.faktum)}
        >
          <ChildAdd /> {getAppTekst("barn.legg-til")}
        </Button>
      )}
    </>
  );
}
