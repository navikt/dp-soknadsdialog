import React from "react";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barnetillegg } from "../barnetillegg/Barnetillegg";
import styles from "./Faktum.module.css";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorSkjema } from "../generator-skjema/GeneratorSkjema";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizGeneratorFaktum } from "../../types/quiz.types";
import { ARBEIDSFORHOLD_FAKTUM_ID, BARN_LISTE_FAKTUM_ID } from "../../constants";

export function FaktumGenerator(props: { faktum: QuizGeneratorFaktum }) {
  return <div>{renderGeneratorType(props.faktum)}</div>;
}

function renderGeneratorType(faktum: QuizGeneratorFaktum) {
  switch (faktum.beskrivendeId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...faktum} />;
    case BARN_LISTE_FAKTUM_ID:
      return <Barnetillegg {...faktum} />;
    default:
      return <StandardGeneratorFaktum {...faktum} />;
  }
}

function StandardGeneratorFaktum(generatorFaktum: QuizGeneratorFaktum) {
  const {
    resetState,
    saveSkjema,
    activeIndex,
    addNewSkjema,
    deleteSkjema,
    generatorSvar,
    toggleActiveSkjema,
    isNewGeneratorSkjema,
  } = useGeneratorState(generatorFaktum.svar);

  return (
    <div>
      <Accordion>
        {generatorSvar.map((faktum, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveSkjema(index)}>
              <>{faktum[0]?.svar}</>
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteSkjema()}>Slett barn</Button>
              <GeneratorSkjema
                templates={generatorFaktum.templates}
                svar={faktum}
                save={(svar) => saveSkjema(generatorFaktum, svar)}
                cancel={resetState}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewGeneratorSkjema && (
        <Button
          className={styles["button-container"]}
          onClick={() => addNewSkjema(generatorSvar.length)}
        >
          Legg til svar
        </Button>
      )}

      {isNewGeneratorSkjema && (
        <GeneratorSkjema
          svar={[]}
          templates={generatorFaktum.templates}
          save={(svar) => saveSkjema(generatorFaktum, svar)}
          cancel={resetState}
        />
      )}
    </div>
  );
}
