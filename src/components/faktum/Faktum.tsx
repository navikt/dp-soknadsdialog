import React, { useEffect, useRef } from "react";
import { FileContent } from "@navikt/ds-icons";
import { FaktumEnvalg } from "./faktum-envalg/FaktumEnvalg";
import { FaktumFlervalg } from "./faktum-flervalg/FaktumFlervalg";
import { IQuizGeneratorFaktum, IQuizNumberFaktum, QuizFaktum } from "../../types/quiz.types";
import { FaktumText } from "./faktum-text/FaktumText";
import { FaktumNumber } from "./faktum-number/FaktumNumber";
import { FaktumDato } from "./faktum-dato/FaktumDato";
import { FaktumPeriode } from "./faktum-periode/FaktumPeriode";
import { FaktumEgetGaardsbrukArbeidsaar } from "./faktum-special-cases/FaktumEgetGaardsbrukArbeidsaar";
import { FaktumLand } from "./faktum-land/FaktumLand";
import { FaktumBoolean } from "./faktum-boolean/FaktumBoolean";
import { FaktumGenerator } from "./faktum-generator/FaktumGenerator";
import { FaktumBooleanReadOnly } from "./faktum-boolean/FaktumBooleanReadOnly";
import { FaktumEnvalgReadOnly } from "./faktum-envalg/FaktumEnvalgReadOnly";
import { FaktumFlervalgReadOnly } from "./faktum-flervalg/FaktumFlervalgReadOnly";
import { FaktumTextReadOnly } from "./faktum-text/FaktumTextReadOnly";
import { FaktumNumberReadOnly } from "./faktum-number/FaktumNumberReadOnly";
import { FaktumLandReadOnly } from "./faktum-land/FaktumLandReadOnly";
import { FaktumDatoReadOnly } from "./faktum-dato/FaktumDatoReadOnly";
import { FaktumPeriodeReadOnly } from "./faktum-periode/FaktumPeriodeReadOnly";
import { useSanity } from "../../context/sanity-context";
import { FaktumGeneratorReadOnly } from "./faktum-generator/FaktumGeneratorReadOnly";
import { useValidation } from "../../context/validation-context";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./Faktum.module.css";
import { useQuiz } from "../../context/quiz-context";
import { QUIZ_SOKNADSTYPE_DAGPENGESOKNAD } from "../../constants";

export interface IFaktum<P> {
  faktum: P;
  readonly?: boolean;
  showAllFaktumTexts?: boolean;
  forceUpdate?: boolean;
  hideAlertText?: boolean;
  isOrkestrator?: boolean;
}

export interface IFaktumReadOnly<P> {
  faktum: P;
  showAllFaktumTexts?: boolean;
}

const FAKTUM_GAARDSBRUK_ARBAAR_FOR_TIMER = "faktum.eget-gaardsbruk-arbeidsaar-for-timer";

export function Faktum(props: IFaktum<QuizFaktum | IQuizGeneratorFaktum>) {
  const { faktum, readonly, showAllFaktumTexts, forceUpdate, hideAlertText, isOrkestrator } = props;
  const { soknadState } = useQuiz();
  const faktumRef = useRef(null);
  const { getAppText, getDokumentkravTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const { scrollIntoView } = useScrollIntoView();
  const { setFocus } = useSetFocus();

  useEffect(() => {
    if (unansweredFaktumId === faktum.id) {
      scrollIntoView(faktumRef);
      setFocus(faktumRef);
    }
  }, [unansweredFaktumId]);

  function renderFaktumType() {
    if (faktum.beskrivendeId === FAKTUM_GAARDSBRUK_ARBAAR_FOR_TIMER) {
      if (faktum.readOnly || readonly) {
        return (
          <FaktumNumberReadOnly
            faktum={faktum as IQuizNumberFaktum}
            showAllFaktumTexts={showAllFaktumTexts}
          />
        );
      }

      return (
        <FaktumEgetGaardsbrukArbeidsaar ref={faktumRef} faktum={faktum as IQuizNumberFaktum} />
      );
    }

    switch (faktum.type) {
      case "boolean":
        if (faktum.readOnly || readonly) {
          return <FaktumBooleanReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumBoolean ref={faktumRef} faktum={faktum} />;
        }

      case "envalg":
        if (faktum.readOnly || readonly) {
          return <FaktumEnvalgReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumEnvalg ref={faktumRef} faktum={faktum} />;
        }

      case "flervalg":
        if (faktum.readOnly || readonly) {
          return <FaktumFlervalgReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumFlervalg ref={faktumRef} faktum={faktum} />;
        }

      case "tekst":
        if (faktum.readOnly || readonly) {
          return <FaktumTextReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumText ref={faktumRef} faktum={faktum} forceUpdate={forceUpdate} />;
        }

      case "double":
      case "int":
        if (faktum.readOnly || readonly) {
          return <FaktumNumberReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumNumber ref={faktumRef} faktum={faktum} />;
        }

      case "land":
        if (faktum.readOnly || readonly) {
          return <FaktumLandReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumLand ref={faktumRef} faktum={faktum} isOrkestrator={isOrkestrator} />;
        }

      case "localdate":
        if (faktum.readOnly || readonly) {
          return <FaktumDatoReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumDato ref={faktumRef} faktum={faktum} />;
        }

      case "periode":
        if (faktum.readOnly || readonly) {
          return <FaktumPeriodeReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumPeriode ref={faktumRef} faktum={faktum} hideAlertText={hideAlertText} />;
        }

      case "generator":
        if (readonly) {
          return (
            <FaktumGeneratorReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />
          );
        } else {
          return <FaktumGenerator faktum={faktum as IQuizGeneratorFaktum} />;
        }
    }
  }

  const shouldRenderDokumentkravText =
    showAllFaktumTexts ||
    (!faktum.readOnly && !readonly && soknadState.versjon_navn === QUIZ_SOKNADSTYPE_DAGPENGESOKNAD);

  return (
    <div className={styles.faktum} data-faktum-id={faktum.beskrivendeId}>
      {renderFaktumType()}

      {shouldRenderDokumentkravText &&
        faktum.sannsynliggjoresAv?.map((dokumentkrav) => {
          const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
          return (
            <p className={styles.dokumentkravContainer} key={dokumentkrav.beskrivendeId}>
              <FileContent aria-hidden />
              {getAppText("soknad.faktum-maa-dokumenteres.del-1")}
              {` ${
                dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId
              }. `}
              {getAppText("soknad.faktum-maa-dokumenteres.del-2")}
            </p>
          );
        })}
    </div>
  );
}
