import React from "react";
import { QuizFaktum, QuizSeksjon } from "../types/quiz.types";
import { Accordion } from "@navikt/ds-react";
import { SummaryFaktum } from "../components/summary/SummaryFaktum";
import { ARBEIDSFORHOLD_FAKTUM_ID } from "../constants";
import { getArbeidsforholdName } from "../components/arbeidsforhold/Arbeidsforhold";

interface Props {
  section: QuizSeksjon[];
}

export function Summary(props: Props) {
  return (
    <>
      <Accordion>
        {props.section?.map((section) => {
          return (
            <>
              <Accordion.Item key={section.beskrivendeId}>
                <Accordion.Header>{section.beskrivendeId}</Accordion.Header>
                <Accordion.Content>
                  <>
                    {section.fakta
                      ?.filter((faktum) => {
                        // Arbeidsforhold vises som en egen accordion
                        return faktum.type !== "generator";
                      })
                      .map((faktum) => {
                        return <SummaryFaktum key={faktum.id} faktum={faktum} />;
                      })}
                  </>
                </Accordion.Content>
              </Accordion.Item>
              {visArbeidsforhold(section)}
            </>
          );
        })}
      </Accordion>
    </>
  );
}

function visArbeidsforhold(section: QuizSeksjon) {
  {
    const arbeidsforholdSvar = section.fakta?.find(
      (faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_FAKTUM_ID
    )?.svar as QuizFaktum[][];

    if (arbeidsforholdSvar && arbeidsforholdSvar.length > 0) {
      return arbeidsforholdSvar.map(function (arbeidsforhold, index) {
        const tittel = getArbeidsforholdName(arbeidsforhold);
        const id = `${section.beskrivendeId}-${index}`;

        return (
          <Accordion.Item key={id}>
            <Accordion.Header>{tittel}</Accordion.Header>
            <Accordion.Content>
              <>
                {arbeidsforhold.map((faktum) => {
                  return <SummaryFaktum key={faktum.id} faktum={faktum} />;
                })}
              </>
            </Accordion.Content>
          </Accordion.Item>
        );
      });
    }
  }
}
