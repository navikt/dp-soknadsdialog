import React from "react";
import { QuizSeksjon } from "../types/quiz.types";
import { Accordion } from "@navikt/ds-react";
import { ARBEIDSFORHOLD_FAKTUM_ID } from "../constants";
import { Arbeidsforhold } from "../components/summary/Arbeidsforhold";
import { Faktum } from "../components/faktum/Faktum";

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
                        return faktum.beskrivendeId !== ARBEIDSFORHOLD_FAKTUM_ID;
                      })
                      .map((faktum) => {
                        return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                      })}
                  </>
                </Accordion.Content>
              </Accordion.Item>
              <Arbeidsforhold section={section} />
            </>
          );
        })}
      </Accordion>
    </>
  );
}
