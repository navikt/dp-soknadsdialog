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
  const { dokumentasjonskrav } = props;
  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>
      {dokumentasjonskrav.krav.map((krav, index) => {
        const formattedCounter = `${index + 1} ${getAppTekst("dokumentkrav.nummer.av.krav")} ${
          dokumentasjonskrav.krav.length
        }`;
        return (
          <div className={styles.dokumentkravContainer} key={index}>
            <Detail key={`${krav.id}-detail`}>{formattedCounter}</Detail>
            <Dokumentkrav key={krav.id} dokumentkrav={krav} />
          </div>
        );
      })}
    </>
  );
}
