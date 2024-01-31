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
  const [showFaktum, setShowFaktum] = useState<boolean>(true);

  const arbeidsforholdVarighet = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet",
  );

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforhold.find(
      (forhold) => forhold.id === event.target.value,
    );

    setShowFaktum(true);
    setCurrentSelectedArbeidsforhold(selectedArbeidsforhold);

    if (!selectedArbeidsforhold) {
      saveFaktumToQuiz(faktum, null);
      return;
    }

    saveFaktumToQuiz(faktum, selectedArbeidsforhold?.organisasjonsnavn);
  }

  // useEffect(() => {
  //   const bedriftsnavn = fakta.find(
  //     (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift",
  //   );

  //   if (
  //     arbeidsforhold?.length &&
  //     bedriftsnavn &&
  //     !bedriftsnavn.svar &&
  //     !currentSelectedArbeidsforhold
  //   ) {
  //     setShowFaktum(false);
  //   }
  // }, [fakta]);

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

    const shouldSaveArbeidsforholdVarighet =
      arbeidsforholdVarighet &&
      (!arbeidsforholdVarighet.svar ||
        JSON.stringify(arbeidsforholdVarighet.svar) !== JSON.stringify(periode));

    if (currentSelectedArbeidsforhold && shouldSaveArbeidsforholdVarighet) {
      saveFaktumToQuiz(arbeidsforholdVarighet, periode);
    }
  }, [fakta, currentSelectedArbeidsforhold]);

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            {faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift" &&
              arbeidsforhold?.length > 0 && (
                <Select
                  className="mb-10"
                  label="Velg arbeidsforhold"
                  onChange={(event) => selectArbeidsforhold(faktum, event)}
                >
                  <option value="">Velg arbeidsforhold</option>
                  {arbeidsforhold.map((forhold) => (
                    <option value={forhold.id} key={forhold.id}>
                      {forhold.organisasjonsnavn}
                    </option>
                  ))}

                  <option value="">Legg til annet</option>
                </Select>
              )}

            {showFaktum && <Faktum faktum={faktum} readonly={props.readonly} />}
          </Fragment>
        );
      })}
    </>
  );
}
