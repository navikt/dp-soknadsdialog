import React, { ChangeEvent, ReactNode } from "react";
import { Select } from "@navikt/ds-react";

interface Props {
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: DropdownOption[];
  currentValue: string;
  placeHolderText?: string;
  description?: ReactNode;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown(props: Props) {
  return (
    <Select
      label={props.label}
      size="medium"
      onChange={props.onChange}
      value={props.currentValue}
      description={props.description && props.description}
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
