import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import { ARBEIDSFORHOLD_FAKTUM_ID, BARN_LISTE_FAKTUM_ID } from "../../constants";
import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { Faktum } from "./Faktum";
import { Delete } from "@navikt/ds-icons";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barn } from "../barn/Barn";

export function FaktumGenerator(props: { faktum: QuizGeneratorFaktum }) {
  return <div>{renderGeneratorType(props.faktum)}</div>;
}

function renderGeneratorType(faktum: QuizGeneratorFaktum) {
  switch (faktum.beskrivendeId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...faktum} />;
    case BARN_LISTE_FAKTUM_ID:
      return <Barn {...faktum} />;
    default:
      return <StandardGenerator {...faktum} />;
  }
}

function StandardGenerator(generatorFaktum: QuizGeneratorFaktum) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();

  return (
    <>
      {generatorFaktum?.svar?.map((faktum, svarIndex) => {
        return (
          <Accordion key={svarIndex}>
            <Accordion.Item open={activeIndex === svarIndex}>
              <Accordion.Header onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                {getStandardTitle(faktum, svarIndex)}
              </Accordion.Header>

              <Accordion.Content>
                {faktum.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} />
                ))}

                <Button
                  variant="danger"
                  onClick={() => deleteGeneratorAnswer(generatorFaktum, svarIndex)}
                >
                  <Delete />
                  Fjern dette svaret
                </Button>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        );
      })}

      <Button variant="secondary" onClick={() => addNewGeneratorAnswer(generatorFaktum)}>
        Legg til svar
      </Button>
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
