import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import {
  ARBEIDSFORHOLD_FAKTUM_ID,
  BARN_LISTE_FAKTUM_ID,
  BARN_LISTE_REGISTER_FAKTUM_ID,
} from "../../constants";
import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { Faktum, FaktumProps } from "./Faktum";
import { Delete } from "@navikt/ds-icons";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barn } from "../barn/Barn";
import { useSanity } from "../../context/sanity-context";
import { BarnPreview } from "../barn/BarnPreview";

export function FaktumGenerator(props: FaktumProps<QuizGeneratorFaktum>) {
  switch (props.faktum.beskrivendeId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...props} />;
    case BARN_LISTE_REGISTER_FAKTUM_ID:
      return (
        <>
          {props.faktum.svar?.map((fakta, index) => (
            <BarnPreview key={index} barnFaktum={fakta} showFaktumInline={true} />
          ))}
        </>
      );
    case BARN_LISTE_FAKTUM_ID:
      return <Barn {...props} />;
    default:
      return <StandardGenerator {...props} />;
  }
}

function StandardGenerator(props: FaktumProps<QuizGeneratorFaktum>) {
  const { addNewGeneratorAnswer, deleteGeneratorAnswer, toggleActiveGeneratorAnswer, activeIndex } =
    useGeneratorUtils();
  const { getAppTekst } = useSanity();

  return (
    <>
      {props.faktum?.svar?.map((faktum, svarIndex) => {
        return (
          <Accordion key={svarIndex}>
            <Accordion.Item open={activeIndex === svarIndex}>
              <Accordion.Header onClick={() => toggleActiveGeneratorAnswer(svarIndex)}>
                {getStandardTitle(faktum, svarIndex)}
              </Accordion.Header>

              <Accordion.Content>
                {faktum.map((faktum) => (
                  <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
                ))}

                {!props.readonly && (
                  <Button
                    variant="danger"
                    onClick={() => deleteGeneratorAnswer(props.faktum, svarIndex)}
                  >
                    <Delete />
                    {getAppTekst("generator.fjern")}
                  </Button>
                )}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        );
      })}

      {!props.readonly && (
        <Button variant="secondary" onClick={() => addNewGeneratorAnswer(props.faktum)}>
          {getAppTekst("generator.legg-til")}
        </Button>
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
