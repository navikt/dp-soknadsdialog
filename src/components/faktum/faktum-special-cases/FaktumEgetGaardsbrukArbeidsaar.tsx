import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useScrollIntoView } from "../../../hooks/useScrollIntoView";
import { useSetFocus } from "../../../hooks/useSetFocus";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { IFaktum } from "../Faktum";

const years: IDropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 4; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export function FaktumEgetGaardsbrukArbeidsaar(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, readonly } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();
  const faktumTexts = useSanity().getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);

  const faktumEgetGaardsbrukArbeidsaarRef = useRef(null);
  const { scrollIntoView } = useScrollIntoView();
  const { setFocus } = useSetFocus();

  useEffect(() => {
    if (unansweredFaktumId === faktum.id) {
      scrollIntoView(faktumEgetGaardsbrukArbeidsaarRef);
      setFocus(faktumEgetGaardsbrukArbeidsaarRef);
    }
  }, [unansweredFaktumId]);

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    setCurrentAnswer(value);
    props.onChange ? props.onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: number) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <Dropdown
      ref={faktumEgetGaardsbrukArbeidsaarRef}
      label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
      onChange={handleOnSelect}
      options={years}
      currentValue={currentAnswer?.toString() || ""}
      placeHolderText={"Velg et år"}
      readOnly={readonly}
      error={
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
      }
      tabIndex={-1}
      aria-invalid={unansweredFaktumId === faktum.id}
    />
  );
}
