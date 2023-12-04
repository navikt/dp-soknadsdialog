import React, { forwardRef, Ref, useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { IFaktum } from "../Faktum";
import { IQuizLandFaktum } from "../../../types/quiz.types";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useRouter } from "next/router";
import { getCountryName } from "../../../utils/country.utils";
import { HelpText } from "../../HelpText";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";
import { ISanityLandGruppe } from "../../../types/sanity.types";
import { AlertText } from "../../alert-text/AlertText";
import { getLandGruppeId } from "../../../utils/faktum.utils";

export const FaktumLand = forwardRef(FaktumLandComponent);

function FaktumLandComponent(
  props: IFaktum<IQuizLandFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const router = useRouter();
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getAppText, getLandGruppeTextById } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [landGruppeText, setLandGruppeText] = useState<ISanityLandGruppe | undefined>();

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

  useEffect(() => {
    const shouldPreSelectNorway =
      !currentAnswer &&
      (faktum.beskrivendeId === "faktum.hvilket-land-bor-du-i" ||
        faktum.beskrivendeId === "faktum.arbeidsforhold.land");

    if (shouldPreSelectNorway) {
      onSelect("NOR");
    }
  }, []);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ?? "");
    }
  }, [faktum]);

  useEffect(() => {
    if (currentAnswer) {
      const landGruppeId = getLandGruppeId(faktum, currentAnswer);
      setLandGruppeText(getLandGruppeTextById(landGruppeId));
    }
  }, [currentAnswer]);

  function onSelect(value: string) {
    saveFaktum(value);
    setCurrentAnswer(value);
  }

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={(e) => onSelect(e.target.value)}
        options={options}
        currentValue={currentAnswer || getAppText("faktum-land.velg-et-land")}
        placeHolderText={getAppText("faktum-land.velg-et-land")}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
        disabled={isLocked}
      />

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}

      {(landGruppeText?.alertText?.title || landGruppeText?.alertText?.body) && (
        <AlertText alertText={landGruppeText.alertText} />
      )}
    </div>
  );
}
