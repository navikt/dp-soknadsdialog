import React from "react";
import { FaktumEnvalg } from "./faktum-envalg/FaktumEnvalg";
import { FaktumFlervalg } from "./faktum-flervalg/FaktumFlervalg";
import styles from "./Faktum.module.css";
import {
  IQuizGeneratorFaktum,
  IQuizNumberFaktum,
  QuizFaktum,
  QuizFaktumSvarType,
} from "../../types/quiz.types";
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
import { FileContent } from "@navikt/ds-icons";
import { useSanity } from "../../context/sanity-context";
import { FaktumGeneratorReadOnly } from "./faktum-generator/FaktumGeneratorReadOnly";

export interface IFaktum<P> {
  faktum: P;
  onChange?: (faktum: QuizFaktum, value: QuizFaktumSvarType) => void;
  readonly?: boolean;
  showAllFaktumTexts?: boolean;
}

export interface IFaktumReadOnly<P> {
  faktum: P;
  showAllFaktumTexts?: boolean;
}

const FAKTUM_GAARDSBRUK_ARBAAR_FOR_TIMER = "faktum.eget-gaardsbruk-arbeidsaar-for-timer";

export function Faktum(props: IFaktum<QuizFaktum | IQuizGeneratorFaktum>) {
  const { faktum, readonly, showAllFaktumTexts } = props;
  const { getAppText, getDokumentkravTextById } = useSanity();

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
        <FaktumEgetGaardsbrukArbeidsaar
          faktum={faktum as IQuizNumberFaktum}
          onChange={props.onChange}
        />
      );
    }

    switch (faktum.type) {
      case "boolean":
        if (faktum.readOnly || readonly) {
          return <FaktumBooleanReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumBoolean faktum={faktum} onChange={props.onChange} />;
        }

      case "envalg":
        if (faktum.readOnly || readonly) {
          return <FaktumEnvalgReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumEnvalg faktum={faktum} onChange={props.onChange} />;
        }

      case "flervalg":
        if (faktum.readOnly || readonly) {
          return <FaktumFlervalgReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumFlervalg faktum={faktum} onChange={props.onChange} />;
        }

      case "tekst":
        if (faktum.readOnly || readonly) {
          return <FaktumTextReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumText faktum={faktum} onChange={props.onChange} />;
        }

      case "double":
      case "int":
        if (faktum.readOnly || readonly) {
          return <FaktumNumberReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumNumber faktum={faktum} onChange={props.onChange} />;
        }

      case "land":
        if (faktum.readOnly || readonly) {
          return <FaktumLandReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumLand faktum={faktum} onChange={props.onChange} />;
        }

      case "localdate":
        if (faktum.readOnly || readonly) {
          return <FaktumDatoReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumDato faktum={faktum} onChange={props.onChange} />;
        }

      case "periode":
        if (faktum.readOnly || readonly) {
          return <FaktumPeriodeReadOnly faktum={faktum} showAllFaktumTexts={showAllFaktumTexts} />;
        } else {
          return <FaktumPeriode faktum={faktum} onChange={props.onChange} />;
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

  const shouldRenderDokumtkravText = showAllFaktumTexts || (!faktum.readOnly && !readonly);
  return (
    <div className={styles.faktum} data-faktum-id={faktum.beskrivendeId}>
      {renderFaktumType()}

      {shouldRenderDokumtkravText &&
        faktum.sannsynliggjoresAv?.map((dokumentkrav) => {
          const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
          return (
            <p className={styles.dokumentkravContainer} key={dokumentkrav.beskrivendeId}>
              <FileContent />
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
