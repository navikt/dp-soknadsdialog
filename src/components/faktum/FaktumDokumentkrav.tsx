import React from "react";
import { FileContent } from "@navikt/ds-icons";
import { useSanity } from "../../context/sanity-context";
import { QuizFaktum } from "../../types/quiz.types";
import styles from "./FaktumDokumentkrav.module.css";

export function FaktumDokumentkrav(dokumentkrav: QuizFaktum) {
  const { getAppTekst, getDokumentkravTextById } = useSanity();

  const dokumentkravText =
    getDokumentkravTextById(dokumentkrav.beskrivendeId) || dokumentkrav.beskrivendeId;

  return (
    <p className={styles.documentedBy}>
      <FileContent />
      {getAppTekst("faktum.ma.dokumenteres.del1")}
      {` ${dokumentkravText}. `}
      {getAppTekst("faktum.ma.dokumenteres.del2")}
    </p>
  );
}
