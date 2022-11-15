import React from "react";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import {
  GENERELL_INNSENDING_KVITTERING_KNAPP_MINE_DAGPENGER,
  GENERELL_INNSENDING_KVITTERING_TEXT,
} from "../../text-constants";
import { Button } from "@navikt/ds-react";
import Link from "next/link";

export function GenerellInnsendingKvittering() {
  const { getInfosideText, getAppText } = useSanity();
  const kvitteringText = getInfosideText(GENERELL_INNSENDING_KVITTERING_TEXT);

  return (
    <>
      {kvitteringText && <PortableText value={kvitteringText.body} />}
      <Link href="https://www.nav.no/no/mine-dagpenger" passHref>
        <Button className="my-6" variant="primary" as="a" size="medium">
          {getAppText(GENERELL_INNSENDING_KVITTERING_KNAPP_MINE_DAGPENGER)}
        </Button>
      </Link>
    </>
  );
}
