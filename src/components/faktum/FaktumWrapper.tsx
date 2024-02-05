import { Select } from "@navikt/ds-react";
import { useQuiz } from "../../context/quiz-context";
import { findArbeidstid, useUserInformation } from "../../context/user-information-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";
import { Faktum } from "./Faktum";
import { Fragment, useEffect, useState } from "react";
import { IArbeidsforhold } from "../arbeidsforhold/ArbeidsforholdList";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function FaktumWrapper(props: IProps) {
  const { fakta } = props;
  const { saveFaktumToQuiz, soknadState } = useQuiz();
  const { getAppText } = useSanity();
  const arbeidstid = findArbeidstid(soknadState);
  const { arbeidsforhold } = useUserInformation(arbeidstid);
  const [currentSelectedArbeidsforhold, setCurrentSelectedArbeidsforhold] = useState<
    IArbeidsforhold | undefined
  >(undefined);
  const [showFaktum, setShowFaktum] = useState<boolean>(true);

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

  const arbeidsforholdVarighet = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet",
  );

  function getPeriode() {
    const periode: IQuizPeriodeFaktumAnswerType = {
      fom: "",
    };

    if (currentSelectedArbeidsforhold) {
      periode.fom = currentSelectedArbeidsforhold.startdato;
    }

    if (currentSelectedArbeidsforhold?.sluttdato) {
      periode.tom = currentSelectedArbeidsforhold.sluttdato;
    }

    return periode;
  }

  function objectsNotEqual(object1: any, object2: any) {
    return JSON.stringify(object1) !== JSON.stringify(object2);
  }

  useEffect(() => {
    if (arbeidsforhold.length > 0 && !currentSelectedArbeidsforhold) {
      setShowFaktum(false);
    }
  }, [currentSelectedArbeidsforhold]);

  useEffect(() => {
    const periode = getPeriode();
    const varighetChanged =
      arbeidsforholdVarighet && objectsNotEqual(arbeidsforholdVarighet.svar, periode);

    if (currentSelectedArbeidsforhold && varighetChanged) {
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
                  label={getAppText("arbeidsforhold.velg.liste")}
                  onChange={(event) => selectArbeidsforhold(faktum, event)}
                >
                  <option value="">{getAppText("arbeidsforhold.velg.liste")}</option>
                  {arbeidsforhold.map((forhold) => (
                    <option value={forhold.id} key={forhold.id}>
                      {forhold.organisasjonsnavn}
                    </option>
                  ))}

                  <option value="">{getAppText("arbeidsforhold.velg.liste.annet")}</option>
                </Select>
              )}

            {showFaktum && <Faktum faktum={faktum} readonly={props.readonly} />}
          </Fragment>
        );
      })}
    </>
  );
}
