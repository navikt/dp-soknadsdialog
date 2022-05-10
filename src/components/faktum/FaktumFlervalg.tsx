import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizFlervalgFaktum } from "../../types/quiz.types";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";
import { getSvaralternativSanityText } from "../../hooks/getSvaralternativSanityText";

export function FaktumFlervalg(props: FaktumProps<QuizFlervalgFaktum>) {
  const { faktum, onChange } = props;

  const faktumText = getFaktumSanityText(faktum.beskrivendeId);

  function onSelection(value: string[]) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: string[]) {}

  return (
    <div>
      {faktumText?.description && <PortableText value={faktumText.description} />}
      {faktumText?.helpText && <p>{faktumText.helpText.title}</p>}

      <CheckboxGroup
        legend={faktumText?.text ? faktumText.text : faktum.beskrivendeId}
        onChange={onSelection}
        value={props.faktum?.svar}
      >
        {faktum.gyldigeValg.map((textId) => {
          const svaralternativText = getSvaralternativSanityText(textId);
          return (
            <Checkbox key={textId} value={textId}>
              {svaralternativText ? svaralternativText.text : textId}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </div>
  );
}
