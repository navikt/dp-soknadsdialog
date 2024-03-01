import { Select } from "@navikt/ds-react";
import { Fragment, useEffect, useState } from "react";
import {
  filterArbeidsforhold,
  findArbeidstid,
  getPeriodeLength,
  getPeriodeObject,
  objectsNotEqual,
  sortArbeidsforhold,
} from "../../utils/arbeidsforhold.utils";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useUserInformation, IArbeidsforhold } from "../../context/user-information-context";
import { QuizFaktum } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper(props: IProps) {
  const { fakta, readonly } = props;
  const { saveFaktumToQuiz, soknadState } = useQuiz();
  const { getAppText } = useSanity();
  const { arbeidsforhold } = useUserInformation();
  const [arbeidsforholdSelectList, setArbeidsforholdSelectList] = useState<IArbeidsforhold[]>([]);
  const [hasSetPeriod, setHasSetPeriod] = useState(false);
  const [currentSelectedArbeidsforhold, setCurrentSelectedArbeidsforhold] = useState<
    IArbeidsforhold | undefined
  >(undefined);
  const [showFaktum, setShowFaktum] = useState<boolean>(true);
  const arbeidstid = findArbeidstid(soknadState);
  const arbeidsforholdVarighet = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet",
  );

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforholdSelectList.find(
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

  useEffect(() => {
    const periodeLength = getPeriodeLength(arbeidstid);
    const filteredArbeidsforhold = filterArbeidsforhold(arbeidsforhold, periodeLength);
    const filteredAndSortedArbeidsforhold = sortArbeidsforhold(filteredArbeidsforhold);

    setArbeidsforholdSelectList(filteredAndSortedArbeidsforhold);
  }, [soknadState]);

  useEffect(() => {
    if (arbeidsforhold.length > 0 && !currentSelectedArbeidsforhold) {
      setShowFaktum(false);
    }
  }, [currentSelectedArbeidsforhold]);

  useEffect(() => {
    const periode = getPeriodeObject(currentSelectedArbeidsforhold);
    const varighetChanged =
      arbeidsforholdVarighet && objectsNotEqual(arbeidsforholdVarighet.svar, periode);

    if (currentSelectedArbeidsforhold && varighetChanged && !hasSetPeriod) {
      setHasSetPeriod(true);
      saveFaktumToQuiz(arbeidsforholdVarighet, periode);
    }
  }, [fakta, currentSelectedArbeidsforhold]);

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            {faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift" &&
              arbeidsforholdSelectList?.length > 0 && (
                <Select
                  className="mb-10"
                  label={getAppText("arbeidsforhold.velg.liste.header")}
                  onChange={(event) => selectArbeidsforhold(faktum, event)}
                >
                  <option value="">
                    {getAppText("arbeidsforhold.velg.liste.velg-arbeidsforhold")}
                  </option>
                  {arbeidsforholdSelectList.map((forhold) => (
                    <option value={forhold.id} key={forhold.id}>
                      {forhold.organisasjonsnavn}
                    </option>
                  ))}
                  <option value="" onClick={() => setShowFaktum(true)}>
                    {getAppText("arbeidsforhold.velg.liste.annet")}
                  </option>
                </Select>
              )}

            {showFaktum && <Faktum faktum={faktum} readonly={readonly} />}
          </Fragment>
        );
      })}
    </>
  );
}
