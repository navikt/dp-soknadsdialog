import React, { useEffect } from "react";
import { Button, Modal } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { QuizGeneratorFaktum } from "../../types/quiz.types";
import { Faktum, FaktumProps } from "../faktum/Faktum";
import { useSanity } from "../../context/sanity-context";
import { BarnPreview } from "./BarnPreview";

export function Barn(props: FaktumProps<QuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { getAppTekst } = useSanity();

  // Set active index to open modal when adding a new child. Quiz returns an empty array after adding a new child.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("props.faktum?.svar: ", props.faktum?.svar);
    if (props.faktum?.svar) {
      const lastGeneratorAnswerIndex = props.faktum.svar.length - 1;
      const lastGeneratorAnswer = props.faktum.svar[lastGeneratorAnswerIndex];

      // eslint-disable-next-line no-console
      console.log("lastGeneratorAnswerIndex: ", lastGeneratorAnswerIndex);
      // eslint-disable-next-line no-console
      console.log("lastGeneratorAnswer: ", lastGeneratorAnswer);
      // eslint-disable-next-line no-console
      console.log("lastGeneratorAnswer?.length === 0: ", lastGeneratorAnswer?.length === 0);

      if (lastGeneratorAnswer?.length === 0) {
        toggleActiveGeneratorAnswer(lastGeneratorAnswerIndex);
      }
    }
  }, [props.faktum?.svar]);

  return (
    <>
      {props.faktum?.svar?.map((faktum, svarIndex) => {
        return (
          <div key={svarIndex}>
            <BarnPreview
              barnFaktum={faktum}
              editChild={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteChild={() => deleteGeneratorAnswer(props.faktum, svarIndex)}
            />

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
