import React from "react";
import classNames from "classnames";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Heading } from "@navikt/ds-react";
import Link from "next/link";
import {
  DOKUMENTKRAV_GENERELL_INNSENDING_TITTEL,
  DOKUMENTKRAV_GENERELL_INNSENDING_LENKE,
  DOKUMENTKRAV_GENERELL_INNSENDING_TEKST,
} from "../../text-constants";
import styles from "./DokumentkravGenerellInnsending.module.css";

export function DokumentkravGenerellInnsending({ classname }: { classname?: string }) {
  const { getAppText } = useSanity();

  return (
    <div className={classNames(styles.documentItem, classname)}>
      <Heading level={"2"} size="medium" className="my-3">
        {getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TITTEL)}
      </Heading>

      <BodyShort>{getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TEKST)}</BodyShort>

      <Link href="/innsending">{getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_LENKE)}</Link>
    </div>
  );
}
