import React, { ChangeEvent, useEffect, useState } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { saveAnswerToQuiz } from "../../store/answers.slice";

export function FaktumNumber(props: FaktumProps<IPrimitivFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.textId === faktum.textId)?.value as number) || undefined;

  const [debouncedValue, setDebouncedValue] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);

  useEffect(() => {
    if (debouncedValue && debouncedValue !== currentAnswer) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  // Tmp conversion to int/float for saving to quiz
  //TODO Add som validation for different int vs float
  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    let number;
    switch (faktum.type) {
      case "int":
        number = parseInt(event.target.value);
        debouncedChange(number);
        break;
      case "double":
        number = parseFloat(event.target.value);
        debouncedChange(number);
        break;
      default:
        // TODO sentry
        // eslint-disable-next-line no-console
        console.error("Wrong component for number. Could not parse text to int or float");
        break;
    }
  }

  function saveFaktum(value: number) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
        type: faktum.type,
        id: faktum.id,
      })
    );
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      <TextField
        defaultValue={currentAnswer}
        label={faktum.title ? faktum.title : faktum.textId}
        step={faktum.type === "double" ? "0.1" : "1"}
        size="medium"
        type="number"
        onChange={onValueChange}
        onBlur={debouncedChange.flush}
      />
    </div>
  );
}
