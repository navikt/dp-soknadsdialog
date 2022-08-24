import { Detail, Heading } from "@navikt/ds-react";
import React from "react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { IDokumentkravListe } from "../types/documentation.types";
import styles from "./Dokumentasjonskrav.module.css";

interface IProps {
  dokumentasjonskrav: IDokumentkravListe;
}

export function Dokumentasjonskrav(props: IProps) {
  const { getAppTekst } = useSanity();
  const { krav } = props.dokumentasjonskrav;
  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>

      {krav.map((dokumentkrav, index) => {
        const formattedCounter = `${index + 1} ${getAppTekst("dokumentkrav.nummer.av.krav")} ${
          krav.length
        }`;

        return (
          <div className={styles.dokumentkravContainer} key={index}>
            <Detail>{formattedCounter}</Detail>
            <Dokumentkrav dokumentkrav={dokumentkrav} />
          </div>
        );
      })}
    </>
  );
}
