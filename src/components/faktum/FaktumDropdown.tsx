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
    (answers.find((answer) => answer.faktumId === faktum.id)?.answer as string) ?? "";

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(faktum.id, event.target.value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <Select
        label={faktum.title ? faktum.title : faktum.id}
        size="medium"
        onChange={onSelect}
        value={currentAnswer}
      >
        <option value="">Velg land eller noe annen placeholder tekst</option>
        {faktum.answerOptions.map((answer) => (
          <option key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </option>
        ))}
      </Select>
    </div>
  );
}
