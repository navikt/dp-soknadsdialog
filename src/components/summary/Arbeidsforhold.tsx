import React from "react";
import { QuizFaktum, QuizSeksjon } from "../../types/quiz.types";
import { Accordion } from "@navikt/ds-react";
import { ARBEIDSFORHOLD_FAKTUM_ID } from "../../constants";
import { getArbeidsforholdName } from "../../components/arbeidsforhold/Arbeidsforhold";
import { Faktum } from "../../components/faktum/Faktum";

interface Props {
  section: QuizSeksjon;
}

export function Arbeidsforhold(props: Props) {
  const arbeidsforholdSvar = props.section.fakta?.find(
    (faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_FAKTUM_ID
  )?.svar as QuizFaktum[][];

  if (arbeidsforholdSvar && arbeidsforholdSvar.length > 0) {
    return (
      <>
        {arbeidsforholdSvar.map((arbeidsforhold, index) => {
          const tittel = getArbeidsforholdName(arbeidsforhold);
          const id = `${props.section.beskrivendeId}-${index}`;

          return (
            <Accordion.Item key={id}>
              <Accordion.Header>{tittel}</Accordion.Header>
              <Accordion.Content>
                <>
                  {arbeidsforhold.map((faktum) => {
                    return <Faktum key={faktum.id} faktum={faktum} />;
                  })}
                </>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </>
    );
  }

  return <></>;
}
