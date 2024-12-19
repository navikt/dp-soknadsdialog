import { Select } from "@navikt/ds-react";
import { ChangeEvent, forwardRef, Ref, useEffect, useState } from "react";
import { useSanity } from "../../../context/sanity-context";
import { useSoknad } from "../../../context/soknad-context";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { IFaktum } from "../Faktum";

interface IDropdownOption {
  value: string;
  label: string;
}

const years: IDropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 4; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export const FaktumEgetGaardsbrukArbeidsaar = forwardRef(FaktumEgetGaardsbrukArbeidsaarComponent);

function FaktumEgetGaardsbrukArbeidsaarComponent(
  props: IFaktum<IQuizNumberFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useSoknad();
  const { unansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();
  const faktumTexts = useSanity().getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState<number | undefined>(faktum.svar);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar);
    }
  }, [faktum]);

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: number) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Select
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        size="medium"
        onChange={handleOnSelect}
        value={currentAnswer?.toString() || ""}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
        disabled={isLocked}
        autoComplete="off"
      >
        <option value="">{getAppText("faktum.eget-gaarsbruk-arbeidsarr.placeholder-tekst")}</option>
        {years.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
