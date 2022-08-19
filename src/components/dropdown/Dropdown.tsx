import React, { ChangeEvent, ReactNode } from "react";
import { Select } from "@navikt/ds-react";

interface IProps {
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: IDropdownOption[];
  currentValue: string;
  placeHolderText?: string;
  description?: ReactNode;
}

export interface IDropdownOption {
  value: string;
  label: string;
}

export function Dropdown(props: IProps) {
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
