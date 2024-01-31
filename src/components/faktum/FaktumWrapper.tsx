import { Select } from "@navikt/ds-react";
import { useQuiz } from "../../context/quiz-context";
import { useUserInformation } from "../../context/user-information-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";
import { Faktum } from "./Faktum";
import { Fragment, useEffect, useState } from "react";
import { IArbeidsforhold } from "../arbeidsforhold/ArbeidsforholdList";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function FaktumWrapper(props: IProps) {
  const { fakta } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { arbeidsforhold } = useUserInformation();
  const [currentSelectedArbeidsforhold, setCurrentSelectedArbeidsforhold] = useState<
    IArbeidsforhold | undefined
  >(undefined);

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforhold.find(
      (forhold) => forhold.id === event.target.value,
    );

    if (!selectedArbeidsforhold) return;

    setCurrentSelectedArbeidsforhold(selectedArbeidsforhold);
    saveFaktumToQuiz(faktum, selectedArbeidsforhold.organisasjonsnavn);
  }

  useEffect(() => {
    const periode: IQuizPeriodeFaktumAnswerType = {
      fom: "",
    };

    if (currentSelectedArbeidsforhold) {
      periode.fom = currentSelectedArbeidsforhold.startdato;
    }

    if (currentSelectedArbeidsforhold?.sluttdato) {
      periode.tom = currentSelectedArbeidsforhold.sluttdato;
    }

    const varighet = fakta.find(
      (faktum) =>
        faktum.beskrivendeId === "faktum.arbeidsforhold.varighet" &&
        (!faktum.svar || JSON.stringify(faktum.svar) !== JSON.stringify(periode)),
    );

    if (currentSelectedArbeidsforhold && varighet) {
      saveFaktumToQuiz(varighet, periode);
    }
  }, [fakta, currentSelectedArbeidsforhold]);

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            {faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift" &&
              arbeidsforhold?.length && (
                <Select
                  label="Velg arbeidsgiver"
                  onChange={(event) => selectArbeidsforhold(faktum, event)}
                >
                  <option key="undefined" value={undefined}></option>
                  {arbeidsforhold.map((forhold) => (
                    <option value={forhold.id} key={forhold.id}>
                      {forhold.organisasjonsnavn}
                    </option>
                  ))}
                </Select>
              )}

            <Faktum faktum={faktum} readonly={props.readonly} />
          </Fragment>
        );
      })}
    </>
  );
}