import { Select } from "@navikt/ds-react";
import { Fragment, useEffect, useState } from "react";
import { useSoknad } from "../../context/soknad-context";
import { useSanity } from "../../context/sanity-context";
import { IArbeidsforhold, useUserInfo } from "../../context/user-info-context";
import { QuizFaktum } from "../../types/quiz.types";
import {
  filterArbeidsforhold,
  findArbeidstid,
  getPeriodeLength,
  getPeriodeObject,
  sortArbeidsforhold,
} from "../../utils/arbeidsforhold.utils";
import { Faktum } from "../faktum/Faktum";
import {
  trackLagtTilArbeidsforholdManuelt,
  trackValgtArbeidsforholdFraAAREG,
} from "../../amplitude/track-arbeidsforhold";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper(props: IProps) {
  const { fakta, readonly } = props;
  const { getAppText } = useSanity();
  const { saveFaktumToQuiz, quizState } = useSoknad();
  const [showFaktum, setShowFaktum] = useState(false);
  const [shouldSaveVarighet, setShouldSaveVarighet] = useState(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const { arbeidsforhold, setContextSelectedArbeidsforhold, contextSelectedArbeidsforhold } =
    useUserInfo();
  const [arbeidsforholdSelectList, setArbeidsforholdSelectList] = useState<IArbeidsforhold[]>([]);
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState<IArbeidsforhold | undefined>(
    undefined,
  );

  const arbeidstid = findArbeidstid(quizState);
  const arbeidsforholdVarighet = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet",
  );

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforholdSelectList.find(
      (forhold) => forhold.id === event.target.value,
    );

    setForceUpdate(true);

    if (event.target.value !== contextSelectedArbeidsforhold?.organisasjonsnavn) {
      setShouldSaveVarighet(true);
    }

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
  }, [quizState]);

  useEffect(() => {
    const periodeLength = getPeriodeLength(arbeidstid);
    const filteredArbeidsforhold = filterArbeidsforhold(arbeidsforhold, periodeLength);
    const filteredAndSortedArbeidsforhold = sortArbeidsforhold(filteredArbeidsforhold);

    if (filteredAndSortedArbeidsforhold.length === 0) {
      setShowFaktum(true);
    }

    setArbeidsforholdSelectList(filteredAndSortedArbeidsforhold);
  }, [quizState]);

  useEffect(() => {
    if (arbeidsforholdVarighet && selectedArbeidsforhold && shouldSaveVarighet) {
      const periode = getPeriodeObject(selectedArbeidsforhold);
      saveFaktumToQuiz(arbeidsforholdVarighet, periode);
      setShouldSaveVarighet(false);
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
