import React, { useEffect } from "react";
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum } from "../../types/quiz.types";
import { Faktum, IFaktum } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { FetchIndicator } from "../FetchIndicator";
import { useQuiz } from "../../context/quiz-context";
import { useRouter } from "next/router";
import { getChildBirthDate, getChildBostedsland, getChildName } from "./BarnRegister";
import { ChildAdd } from "../../svg-icons/ChildAdd";

export function Barn(props: IFaktum<IQuizGeneratorFaktum>) {
  const { faktum } = props;
  const { locale } = useRouter();
  const { isLoading } = useQuiz();
  const { getAppTekst } = useSanity();
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
  }, [faktum?.svar]);

  return (
    <>
      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
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
          icon={<ChildAdd />}
        >
          {getAppTekst("barn.legg-til")}
        </Button>
      )}
    </>
  );
}
