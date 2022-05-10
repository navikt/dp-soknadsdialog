import React from "react";
import { Alert, Radio, RadioGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import { QuizValgFaktum } from "../../types/quiz.types";
import { SanityContext } from "../../pages/[uuid]";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";
import { getSvaralternativSanityText } from "../../hooks/getSvaralternativSanityText";

export function FaktumValg(props: FaktumProps<QuizValgFaktum>) {
  const { faktum, onChange } = props;
  const faktumText = getFaktumSanityText(faktum.beskrivendeId);

  function onSelection(value: string) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: string) {
    const mappedAnswer = faktum.type === "boolean" ? mapStringToBoolean(value) : value;

    if (mappedAnswer === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("ERROR");
    }
  }

  // eslint-disable-next-line no-console
  console.log(faktumText);
  return (
    <div>
      {faktumText?.description && <PortableText value={faktumText.description} />}
      {faktumText?.helpText && <p>{faktumText.helpText.title}</p>}

      <RadioGroup
        legend={faktumText ? faktumText.text : faktum.beskrivendeId}
        onChange={onSelection}
        value={props.faktum?.svar}
      >
        {faktum.gyldigeValg.map((textId) => {
          const svaralternativText = getSvaralternativSanityText(textId);
          return (
            <div key={textId}>
              <Radio value={textId}>{svaralternativText ? svaralternativText.text : textId}</Radio>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

function mapStringToBoolean(value: string): boolean | undefined {
  if (value.match(".*.svar.ja")) {
    return true;
  }

  if (value.match(".*.svar.nei")) {
    return false;
  }

  return undefined;
}
