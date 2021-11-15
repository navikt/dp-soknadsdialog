import { Radio, RadioGroup } from "@navikt/ds-react"

export interface RadioOption {
  text: string;
  value: string;
}

interface RadioGroupInput {
  legend: string;
  options: RadioOption[];
  onSelection: (value: string) => void;
}

export const RadioButtonInput = ({ legend, options, onSelection }: RadioGroupInput) => {
  return (
    <RadioGroup legend={legend} onChange={onSelection}>
      {options.map((opt, index) => <Radio key={index} value={opt.value}>{opt.text}</Radio>)}
    </RadioGroup> 
  );
}
