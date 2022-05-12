import React, { useEffect, useState } from "react";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";
import { QuizTekstFaktum } from "../../types/quiz.types";
import { saveFaktumToQuiz } from "../../api/answer-service";
import { useRouter } from "next/router";

export function FaktumText(props: FaktumProps<QuizTekstFaktum>) {
  const faktumTexts = getFaktumSanityText(props.faktum.beskrivendeId);
  const { faktum, onChange } = props;
  const { uuid } = useRouter().query;

  const [debouncedText, setDebouncedText] = useState(faktum.svar);
  const debouncedChange = useDebouncedCallback(setDebouncedText, 500);

  useEffect(() => {
    if (debouncedText && debouncedText !== faktum.svar) {
      onChange ? onChange(faktum, debouncedText) : saveFaktum(debouncedText);
    }
  }, [debouncedText]);

  function saveFaktum(value: string) {
    saveFaktumToQuiz(uuid as string, faktum, value);
  }

  return (
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      {faktumTexts?.helpText && <p>{faktumTexts.helpText.title}</p>}
      <TextField
        defaultValue={faktum?.svar}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        size="medium"
        type="text"
        onChange={(event) => debouncedChange(event.currentTarget.value)}
        onBlur={debouncedChange.flush}
      />
    </div>
  );
}
