import { Select } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import { ChangeEvent, forwardRef, Ref, useEffect, useState } from "react";
import { useSanity } from "../../../context/sanity-context";
import { useSoknad } from "../../../context/soknad-context";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizLandFaktum } from "../../../types/quiz.types";
import { ISanityLandGruppe } from "../../../types/sanity.types";
import { getCountryName } from "../../../utils/country.utils";
import { getLandGruppeId } from "../../../utils/faktum.utils";
import { AlertText } from "../../alert-text/AlertText";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";

import styles from "../Faktum.module.css";

export const FaktumLand = forwardRef(FaktumLandComponent);

interface IDropdownOption {
  value: string;
  label: string;
}

function FaktumLandComponent(
  props: IFaktum<IQuizLandFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const router = useRouter();
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useSoknad();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getAppText, getLandGruppeTextById } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [landGruppeText, setLandGruppeText] = useState<ISanityLandGruppe | undefined>();

  const faktumHvilketLandBorDuI = faktum.beskrivendeId === "faktum.hvilket-land-bor-du-i";
  const faktumArbeidsforholdLand = faktum.beskrivendeId === "faktum.arbeidsforhold.land";

  const sortByLabel = (optionA: IDropdownOption, optionB: IDropdownOption) => {
    if (optionA.label === optionB.label) return 0;
    return optionA.label > optionB.label ? 1 : -1;
  };

  const options = faktum.gyldigeLand
    .map((code) => ({
      value: code,
      label: getCountryName(code, router.locale),
    }))
    .sort(sortByLabel);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ?? "");
    }
  }, [faktum]);

  useEffect(() => {
    const shouldPreSelectNorway = !currentAnswer && faktumArbeidsforholdLand;

    if (shouldPreSelectNorway) {
      saveFaktum("NOR");
      setCurrentAnswer("NOR");
    }
  }, []);

  useEffect(() => {
    if (currentAnswer) {
      const landGruppeId = getLandGruppeId(faktum, currentAnswer);
      setLandGruppeText(getLandGruppeTextById(landGruppeId));
    }
  }, [currentAnswer]);

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    saveFaktum(value);
    setCurrentAnswer(value);
  }

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value !== "" ? value : null);
  }

  function getLandOptions() {
    if (faktumHvilketLandBorDuI) {
      return (
        <>
          <option value="">{getAppText("faktum-land.velg-et-land")}</option>
          <optgroup label={getAppText("faktum-land.optgroup.ofte-valgte-land")}>
            <option value="NOR">Norge</option>
            <option value="SWE">Sverige</option>
            <option value="POL">Polen</option>
          </optgroup>
          <optgroup label={getAppText("faktum-land.optgroup.flere-land")}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        </>
      );
    }

    return (
      <>
        <option value="">{getAppText("faktum-land.velg-et-land")}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </>
    );
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Select
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        size="medium"
        onChange={(e) => onSelect(e)}
        value={currentAnswer || getAppText("faktum-land.velg-et-land")}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
        disabled={isLocked}
        autoComplete="off"
      >
        {getLandOptions()}
      </Select>

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}

      {(landGruppeText?.alertText?.title || landGruppeText?.alertText?.body) && (
        <AlertText alertText={landGruppeText.alertText} />
      )}
    </div>
  );
}
