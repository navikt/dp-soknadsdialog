import React, { useEffect } from "react";
import { BodyShort, Button, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import { Faktum, FaktumProps } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { PingLoader } from "../PingLoader";
import { useQuiz } from "../../context/quiz-context";

export function Barn(props: FaktumProps<QuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { getAppTekst } = useSanity();
  const { isLoading } = useQuiz();

  // Set active index to open modal when adding a new child. Quiz returns an array with 1 faktum after adding a new child.
  useEffect(() => {
    if (props.faktum?.svar) {
      const lastGeneratorAnswerIndex = props.faktum.svar.length - 1;
      const lastGeneratorAnswer = props.faktum.svar[lastGeneratorAnswerIndex];

      if (lastGeneratorAnswer?.length === 1) {
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
              <BodyShort>{getChildName(faktum)}</BodyShort>
              <BodyShort size={"small"}>{getChildBirthDate(faktum)}</BodyShort>
            </GeneratorFaktumCard>

            <Modal
              open={activeIndex === svarIndex}
              closeButton={false}
              shouldCloseOnOverlayClick={false}
              onClose={() => toggleActiveGeneratorAnswer(svarIndex)}
            >
              <Modal.Content>
                {faktum.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                {isLoading && (
                  <div>
                    <PingLoader />
                  </div>
                )}

                <Button onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>Lage og lukk</Button>
              </Modal.Content>
            </Modal>
          </div>
        );
      })}

      {!props.readonly && (
        <Button variant="secondary" onClick={() => addNewGeneratorAnswer(props.faktum)}>
          {getAppTekst("barn.legg-til")}
        </Button>
      )}
    </>
  );
}

function getChildBirthDate(barnetillegg: QuizFaktum[]) {
  return barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-foedselsdato")
    ?.svar as string;
}

function getChildName(barnetillegg: QuizFaktum[]): string {
  const firstName = barnetillegg.find(
    (svar) => svar.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.svar as string;

  const lastName = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  return `${firstName} ${lastName}`;
}
