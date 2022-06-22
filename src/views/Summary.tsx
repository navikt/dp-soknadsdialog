import React from "react";
import { QuizSeksjon } from "../types/quiz.types";
import { Accordion } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";

interface Props {
  sections: QuizSeksjon[];
}

export function Summary(props: Props) {
  return (
    <>
      <Accordion>
        {props.sections?.map((section) => {
          return (
            <>
              <Accordion.Item key={section.beskrivendeId}>
                <Accordion.Header>{section.beskrivendeId}</Accordion.Header>
                <Accordion.Content>
                  <>
                    {section.fakta.map((faktum) => {
                      return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                    })}
                  </>
                </Accordion.Content>
              </Accordion.Item>
            </>
          );
        })}
      </Accordion>
    </>
  );
}
