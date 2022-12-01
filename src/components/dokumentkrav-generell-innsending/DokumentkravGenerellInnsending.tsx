import React, { useState } from "react";
import classNames from "classnames";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={classNames(styles.documentItem, classname)}>
      <Heading level={"2"} size="medium" className="my-3">
        {getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TITTEL)}
      </Heading>

      <BodyShort>{getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_TEKST)}</BodyShort>

      <Link href="/generell-innsending" passHref>
        <Button as="a" variant="tertiary" loading={isLoading} onClick={() => setIsLoading(true)}>
          {getAppText(DOKUMENTKRAV_GENERELL_INNSENDING_LENKE)}
        </Button>
      </Link>
    </div>
  );
}
