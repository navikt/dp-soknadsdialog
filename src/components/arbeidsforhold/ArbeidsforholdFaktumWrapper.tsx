import { Select } from "@navikt/ds-react";
import { Fragment, useEffect, useState } from "react";
import {
  trackLagtTilArbeidsforholdManuelt,
  trackValgtArbeidsforholdFraAAREG,
} from "../../amplitude.tracking";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { IArbeidsforhold, useUserInformation } from "../../context/user-information-context";
import { QuizFaktum } from "../../types/quiz.types";
import {
  filterArbeidsforhold,
  findArbeidstid,
  getPeriodeLength,
  getPeriodeObject,
  sortArbeidsforhold,
} from "../../utils/arbeidsforhold.utils";
import { Faktum } from "../faktum/Faktum";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper(props: IProps) {
  const { fakta, readonly } = props;
  const { getAppText } = useSanity();
  const { saveFaktumToQuiz, soknadState } = useQuiz();
  const [showFaktum, setShowFaktum] = useState(true);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const { arbeidsforhold, setContextSelectedArbeidsforhold } = useUserInformation();
  const [arbeidsforholdSelectList, setArbeidsforholdSelectList] = useState<IArbeidsforhold[]>([]);
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState<IArbeidsforhold | undefined>(
    undefined,
  );

  const arbeidstid = findArbeidstid(soknadState);
  const arbeidsforholdVarighet = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet",
  );

  const arbeidsforholdBedriftsnavn = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift",
  );

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforholdSelectList.find(
      (forhold) => forhold.id === event.target.value,
    );

    setForceUpdate(true);

    if (!event.target.value) {
      setShowFaktum(false);
      saveFaktumToQuiz(faktum, null);
      setContextSelectedArbeidsforhold(undefined);
      return;
    }

    if (event.target.value === "add-manually") {
      setShowFaktum(true);
      saveFaktumToQuiz(faktum, null);
      trackLagtTilArbeidsforholdManuelt("dagpenger");
      setContextSelectedArbeidsforhold(undefined);
      return;
    }

    if (selectedArbeidsforhold) {
      setShowFaktum(true);
      setForceUpdate(true);
      setSelectedArbeidsforhold(selectedArbeidsforhold);
      trackValgtArbeidsforholdFraAAREG("dagpenger");
      setContextSelectedArbeidsforhold(selectedArbeidsforhold);
      saveFaktumToQuiz(faktum, selectedArbeidsforhold?.organisasjonsnavn);
    }
  }

  function hideAlertText(faktum: QuizFaktum): boolean {
    return (
      ["faktum.arbeidsforhold.varighet"].includes(faktum.beskrivendeId) &&
      arbeidsforholdSelectList.length === 0
    );
  }

  useEffect(() => {
    if (forceUpdate) setForceUpdate(false);
  }, [soknadState]);

  useEffect(() => {
    const periodeLength = getPeriodeLength(arbeidstid);
    const filteredArbeidsforhold = filterArbeidsforhold(arbeidsforhold, periodeLength);
    const filteredAndSortedArbeidsforhold = sortArbeidsforhold(filteredArbeidsforhold);

    setArbeidsforholdSelectList(filteredAndSortedArbeidsforhold);
  }, [soknadState]);

  useEffect(() => {
    if (arbeidsforhold.length > 0 && !selectedArbeidsforhold && !arbeidsforholdBedriftsnavn?.svar) {
      setShowFaktum(false);
    }
  }, [selectedArbeidsforhold]);

  useEffect(() => {
    if (arbeidsforholdVarighet && !arbeidsforholdVarighet?.svar && selectedArbeidsforhold) {
      const periode = getPeriodeObject(selectedArbeidsforhold);
      saveFaktumToQuiz(arbeidsforholdVarighet, periode);
    }
  }, [fakta, selectedArbeidsforhold]);

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
                  <option value="add-manually">
                    {getAppText("arbeidsforhold.velg.liste.annet")}
                  </option>
                </Select>
              )}

            {showFaktum && (
              <Faktum
                faktum={faktum}
                readonly={readonly}
                forceUpdate={forceUpdate}
                hideAlertText={hideAlertText(faktum)}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}
