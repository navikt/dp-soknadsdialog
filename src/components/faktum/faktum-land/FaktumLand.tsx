import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import { forwardRef, Ref, useEffect, useState } from "react";
import { useAppContext } from "../../../context/app-context";
import { useSoknad } from "../../../context/soknad-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizLandFaktum } from "../../../types/quiz.types";
import { ISanityLandGruppe } from "../../../types/sanity.types";
import { getCountryName } from "../../../utils/country.utils";
import { getLandGruppeId } from "../../../utils/faktum.utils";
import { AlertText } from "../../alert-text/AlertText";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";

export const FaktumLand = forwardRef(FaktumLandComponent);

function FaktumLandComponent(
  props: IFaktum<IQuizLandFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const router = useRouter();
  const { faktum, isOrkestrator } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, saveOpplysningToOrkestrator, isLocked } = useSoknad();
  const { landgrupper } = useAppContext();
  const { unansweredFaktumId } = useValidation();

  const { getFaktumTextById, getAppText, getLandGruppeTextById } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [landGruppeText, setLandGruppeText] = useState<ISanityLandGruppe | undefined>();

  const sortByLabel = (optionA: IDropdownOption, optionB: IDropdownOption) => {
    if (optionA.label === optionB.label) return 0;
    return optionA.label > optionB.label ? 1 : -1;
  };

  function getOptions() {
    if (isOrkestrator && landgrupper) {
      return landgrupper
        .filter((group) => faktum.gyldigeLand.includes(group.gruppenavn))
        .map((group) => {
          return group.land;
        })
        .flat()
        .map((code) => ({
          value: code,
          label: getCountryName(code, router.locale),
        }))
        .sort(sortByLabel);
    }

    return faktum.gyldigeLand
      .map((code) => ({
        value: code,
        label: getCountryName(code, router.locale),
      }))
      .sort(sortByLabel);
  }

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
    if (!isOrkestrator) {
      saveFaktumToQuiz(faktum, value);
    }

    if (isOrkestrator) {
      saveOpplysningToOrkestrator(props.faktum.id, "land", value);
    }
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={(e) => onSelect(e.target.value)}
        options={getOptions()}
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
