import { BodyShort, Label, Select } from "@navikt/ds-react";
import { ChangeEvent, ReactNode } from "react";

interface IProps {
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: IDropdownOption[];
  currentValue: string;
  placeHolderText?: string;
  description?: ReactNode;
  readOnly?: boolean;
  error?: string;
  disabled?: boolean;
}

export interface IDropdownOption {
  value: string;
  label: string;
}

export function Dropdown(props: IProps) {
  if (props.readOnly) {
    return (
      <>
        <Label as={"p"}>{props.label}</Label>
        <BodyShort>{props.currentValue}</BodyShort>
      </>
    );
  }

  return (
    <Select
      label={props.label}
      size="medium"
      onChange={props.onChange}
      value={props.currentValue}
      description={props.description && props.description}
      error={props.error}
      disabled={props.disabled}
      autoComplete="off"
    >
      {props.placeHolderText && <option value="">{props.placeHolderText}</option>}
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
