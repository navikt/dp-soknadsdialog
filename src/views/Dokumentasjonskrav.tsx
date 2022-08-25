import { Detail } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { IDokumentkravListe } from "../types/documentation.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import styles from "./Dokumentasjonskrav.module.css";

interface IProps {
  dokumentasjonskrav: IDokumentkravListe;
}

export function Dokumentasjonskrav(props: IProps) {
  const { getAppTekst, getInfosideText } = useSanity();
  const { dokumentasjonskrav } = props;
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");
  return (
    <>
      {dokumentasjonskravText?.body && <PortableText value={dokumentasjonskravText.body} />}
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

      <NoSessionModal />
    </>
  );
}
