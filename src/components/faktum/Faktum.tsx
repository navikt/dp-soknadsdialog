import React, { useEffect, useRef } from "react";
import { FaktumEnvalg } from "./FaktumEnvalg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import styles from "./Faktum.module.css";
import {
  QuizFaktum,
  QuizFaktumSvarType,
  IQuizGeneratorFaktum,
  IQuizNumberFaktum,
} from "../../types/quiz.types";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumDato } from "./FaktumDato";
import { FaktumPeriode } from "./FaktumPeriode";
import { FaktumEgetGaardsbrukArbeidsaar } from "./faktum-special-cases/FaktumEgetGaardsbrukArbeidsaar";
import { FaktumLand } from "./FaktumLand";
import { FaktumBoolean } from "./FaktumBoolean";
import { FaktumGenerator } from "./FaktumGenerator";
import { FaktumDokumentkrav } from "./FaktumDokumentkrav";
import { useQuiz } from "../../context/quiz-context";
import { QUIZ_SOKNADSTYPE_DAGPENGESOKNAD } from "../../constants";
import { useValidation } from "../../context/validation-context";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useSetFocus } from "../../hooks/useSetFocus";

export interface IFaktum<P> {
  faktum: P;
  onChange?: (faktum: QuizFaktum, value: QuizFaktumSvarType) => void;
  readonly?: boolean;
}

const FAKTUM_GAARDSBRUK_ARBAAR_FOR_TIMER = "faktum.eget-gaardsbruk-arbeidsaar-for-timer";

export function Faktum(props: IFaktum<QuizFaktum | IQuizGeneratorFaktum>) {
  const { soknadState } = useQuiz();
  const { faktum, readonly } = props;
  const { unansweredFaktumId } = useValidation();
  const faktumRef = useRef(null);
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
      return (
        <FaktumEgetGaardsbrukArbeidsaar
          ref={faktumRef}
          faktum={faktum as IQuizNumberFaktum}
          onChange={props.onChange}
          readonly={readonly}
        />
      );
    }

    switch (faktum.type) {
      case "boolean":
        return (
          <FaktumBoolean
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "envalg":
        return (
          <FaktumEnvalg
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "flervalg":
        return (
          <FaktumFlervalg
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "tekst":
        return (
          <FaktumText
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "double":
      case "int":
        return (
          <FaktumNumber
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "land":
        return (
          <FaktumLand
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "localdate":
        return (
          <FaktumDato
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "periode":
        return (
          <FaktumPeriode
            ref={faktumRef}
            faktum={faktum}
            onChange={props.onChange}
            readonly={readonly}
          />
        );

      case "generator":
        return <FaktumGenerator faktum={faktum as IQuizGeneratorFaktum} readonly={readonly} />;
    }
  }

  function renderDokumentkrav() {
    if (faktum.readOnly || readonly) {
      return;
    }

    return props.faktum.sannsynliggjoresAv?.map((dokumentkrav) => (
      <FaktumDokumentkrav key={dokumentkrav.beskrivendeId} {...dokumentkrav} />
    ));
  }

  return (
    <div className={styles.faktum} data-faktum-id={faktum.beskrivendeId}>
      {renderFaktumType()}
      {soknadState.versjon_navn === QUIZ_SOKNADSTYPE_DAGPENGESOKNAD && renderDokumentkrav()}
    </div>
  );
}
