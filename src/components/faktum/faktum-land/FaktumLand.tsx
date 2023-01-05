import React, { forwardRef, Ref, useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { IFaktum } from "../Faktum";
import { IQuizLandFaktum } from "../../../types/quiz.types";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useRouter } from "next/router";
import { getCountryName } from "../../../country.utils";
import { HelpText } from "../../HelpText";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";

export const FaktumLand = forwardRef(FaktumLandComponent);

function FaktumLandComponent(
  props: IFaktum<IQuizLandFaktum>,
  ref: Ref<HTMLDivElement> | undefined
) {
  const router = useRouter();
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getAppText } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar || "");

  const sortByLabel = (optionA: IDropdownOption, optionB: IDropdownOption) => {
    if (optionA.label === optionB.label) return 0;
    return optionA.label > optionB.label ? 1 : -1;
  };

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
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

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  function onSelect(value: string) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
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
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
      />

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </div>
  );
}
