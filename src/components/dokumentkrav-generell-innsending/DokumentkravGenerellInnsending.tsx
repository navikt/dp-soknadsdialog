import React, { useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import styles from "./DokumentkravGenerellInnsending.module.css";

interface IProps {
  classname?: string;
}

export function DokumentkravGenerellInnsending({ classname }: IProps) {
  const { getAppText } = useSanity();
  const [navigating, setNavigating] = useState(false);

  return (
    <div className={classname}>
      <Heading level={"2"} size="small" className="my-3">
        {getAppText("dokumentkrav.generell-innsending.tittel")}
      </Heading>

      <BodyShort className={styles.innsendingText}>
        {getAppText("dokumentkrav.generell-innsending.tekst")}
      </BodyShort>

      <Link href="/generell-innsending" passHref legacyBehavior>
        <Button as="a" variant="tertiary" loading={navigating} onClick={() => setNavigating(true)}>
          {getAppText("dokumentkrav.generell-innsending.lenke")}
        </Button>
      </Link>
    </div>
  );
}
