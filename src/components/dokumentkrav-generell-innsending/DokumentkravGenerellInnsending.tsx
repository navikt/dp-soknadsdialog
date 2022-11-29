import React from "react";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Heading } from "@navikt/ds-react";
import Link from "next/link";
import {
  DOKUMENTKRAV_GENERELL_INNSENDING_TITTEL,
  DOKUMENTKRAV_GENERELL_INNSENDING_LENKE,
  DOKUMENTKRAV_GENERELL_INNSENDING_TEKST,
} from "../../text-constants";
import styles from "./DokumentkravGenerellInnsending.module.css";

interface IProps {
  classname?: string;
}

export function DokumentkravGenerellInnsending({ classname }: IProps) {
  const { getAppText } = useSanity();

  return (
    <div className={classname}>
      <Heading level={"2"} size="small" className="my-3">
        {getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TITTEL)}
      </Heading>

      <BodyShort className={styles.innsendingText}>
        {getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TEKST)}
      </BodyShort>

      <Link href="/generell-innsending">{getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_LENKE)}</Link>
    </div>
  );
}
