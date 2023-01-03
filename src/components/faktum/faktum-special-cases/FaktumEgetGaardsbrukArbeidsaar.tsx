import { ChangeEvent, forwardRef, Ref, useState } from "react";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { IFaktum } from "../Faktum";

const years: IDropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 4; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export const FaktumEgetGaardsbrukArbeidsaar = forwardRef(FaktumEgetGaardsbrukArbeidsaarComponent);

function FaktumEgetGaardsbrukArbeidsaarComponent(
  props: IFaktum<IQuizNumberFaktum>,
  ref: Ref<HTMLDivElement> | undefined
) {
  const { faktum, readonly } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();
  const faktumTexts = useSanity().getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    setCurrentAnswer(value);
    props.onChange ? props.onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: number) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        onChange={handleOnSelect}
        options={years}
        currentValue={currentAnswer?.toString() || ""}
        placeHolderText={getAppText("faktum.eget-gaarsbruk-arbeidsarr.placeholder-tekst")}
        readOnly={readonly}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
      />
    </div>
  );
}
