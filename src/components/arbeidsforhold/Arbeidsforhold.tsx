import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import { Delete } from "@navikt/ds-icons";

export function Arbeidsforhold(generatorFaktum: QuizGeneratorFaktum) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();

  return (
    <>
      {generatorFaktum?.svar?.map((faktum, svarIndex) => {
        return (
          <Accordion key={svarIndex}>
            <Accordion.Item open={activeIndex === svarIndex}>
              <Accordion.Header onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                {getArbeidsforholdName(faktum)}
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
                  Fjern dette arbeidsforholdet
                </Button>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        );
      })}

      <Button variant="secondary" onClick={() => addNewGeneratorAnswer(generatorFaktum)}>
        Legg til arbeidsforhold
      </Button>
    </>
  );
}

export function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift")
      ?.svar as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}
