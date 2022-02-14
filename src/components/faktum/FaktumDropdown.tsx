import React, { ChangeEvent } from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Select } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function FaktumDropdown(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.faktumId === faktum.beskrivendeId)?.answer as string) ?? "";

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(faktum.beskrivendeId, event.target.value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <Select
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        size="medium"
        onChange={onSelect}
        value={currentAnswer}
      >
        <option value="">Velg land eller noe annen placeholder tekst</option>
        {faktum.answerOptions.map((answer) => (
          <option key={answer.beskrivendeId} value={answer.beskrivendeId}>
            {answer.title ? answer.title : answer.beskrivendeId}
          </option>
        ))}
      </Select>
    </div>
  );
}
