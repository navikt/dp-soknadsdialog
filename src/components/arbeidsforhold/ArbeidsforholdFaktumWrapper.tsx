import { Select } from "@navikt/ds-react";
import { Fragment, useEffect, useState } from "react";
import {
  filterArbeidsforhold,
  findArbeidstid,
  getPeriodeLength,
  sortArbeidsforhold,
} from "../../context/arbeidsforhold.utils";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useUserInformation } from "../../context/user-information-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";
import { IArbeidsforhold } from "./ArbeidsforholdList";
import { Faktum } from "../faktum/Faktum";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper(props: IProps) {
  const { fakta } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getAppText } = useSanity();
  const { arbeidsforhold, arbeidstid, setArbeidstid } = useUserInformation();

  const [arbeidsforholdList, setArbeidsforholdList] = useState(arbeidsforhold);
  const [currentSelectedArbeidsforhold, setCurrentSelectedArbeidsforhold] = useState<
    IArbeidsforhold | undefined
  >(undefined);
  const [showFaktum, setShowFaktum] = useState<boolean>(true);

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforholdList.find(
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

  function objectsNotEqual<T>(object1: T, object2: T) {
    return JSON.stringify(object1) !== JSON.stringify(object2);
  }

  useEffect(() => {
    if (arbeidsforholdList.length > 0 && !currentSelectedArbeidsforhold) {
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

  // Her skal trigges hvis verdien til faktum: faktum.type-arbeidstid har endret
  useEffect(() => {
    setArbeidstid(arbeidstid);

    const periodeLength = getPeriodeLength(arbeidstid);
    const filteredArbeidsforhold = filterArbeidsforhold(arbeidsforholdList, periodeLength);

    const filteredAndSortedArbeidsforhold = filteredArbeidsforhold.sort(
      (forhold1: IArbeidsforhold, forhold2: IArbeidsforhold) =>
        sortArbeidsforhold(forhold1, forhold2),
    );

    setArbeidsforholdList(filteredAndSortedArbeidsforhold);
  }, []);

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            {faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift" &&
              arbeidsforholdList?.length > 0 && (
                <Select
                  className="mb-10"
                  label={getAppText("arbeidsforhold.velg.liste")}
                  onChange={(event) => selectArbeidsforhold(faktum, event)}
                >
                  <option value="">{getAppText("arbeidsforhold.velg.liste")}</option>
                  {arbeidsforholdList.map((forhold) => (
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
