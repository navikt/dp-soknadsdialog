import React from "react";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Button } from "@navikt/ds-react";
import Link from "next/link";

export function GenerellInnsendingKvittering() {
  const { getInfosideText, getAppText } = useSanity();
  const kvitteringText = getInfosideText("generell-innsending.kvittering.text");

  return (
    <>
      {kvitteringText && <PortableText value={kvitteringText.body} />}
      <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref>
        <Button className="my-6" variant="primary" as="a" size="medium">
          {getAppText("generell-innsending.kvittering.knapp.mine-dagpenger")}
        </Button>
      </Link>
    </>
  );
}
