import React from "react";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Button, Heading, Label } from "@navikt/ds-react";
import Link from "next/link";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useSoknad } from "../../context/soknad-context";
import { Faktum } from "../../components/faktum/Faktum";
import styles from "./GenerellInnsendingKvittering.module.css";
import api from "../../utils/api.utils";
import { PageMeta } from "../../components/PageMeta";

export function GenerellInnsendingKvittering() {
  const { getInfosideText, getAppText } = useSanity();
  const kvitteringText = getInfosideText("generell-innsending.kvittering.text");

  const { quizState } = useSoknad();
  const { dokumentkravList } = useDokumentkrav();

  return (
    <>
      <PageMeta title={getAppText("innsending-kvittering.side-metadata.tittel")} />
      <main id="maincontent" tabIndex={-1}>
        {kvitteringText && <PortableText value={kvitteringText.body} />}

        <div className="my-11">
          <Heading level="2" size="medium" spacing>
            {getAppText("generell-innsending.kvittering.dine-svar")}
          </Heading>

          {quizState.seksjoner.map((section) => {
            return section.fakta.map((faktum) => {
              return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
            });
          })}

          <Label as="p">{getAppText("generell-innsending.kvittering.vedlagt-dokument")}</Label>
          <ol className={styles.dokumentkravList}>
            {dokumentkravList.krav.map((dokumentkrav) => {
              return (
                <li key={dokumentkrav.beskrivendeId}>
                  <div className={styles.dokumentkravTitle}>
                    <a
                      href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {getAppText("generell-innsending.kvittering.se-vedlagt-dokument")}
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref legacyBehavior>
          <Button className="my-6" variant="primary" as="a" size="medium">
            {getAppText("generell-innsending.kvittering.knapp.mine-dagpenger")}
          </Button>
        </Link>
      </main>
    </>
  );
}
