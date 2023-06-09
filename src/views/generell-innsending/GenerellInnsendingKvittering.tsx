import React from "react";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Button, Heading, Tag } from "@navikt/ds-react";
import Link from "next/link";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useQuiz } from "../../context/quiz-context";
import { Faktum } from "../../components/faktum/Faktum";
import styles from "./GenerellInnsendingKvittering.module.css";
import api from "../../api.utils";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { PageMeta } from "../../components/PageMeta";

export function GenerellInnsendingKvittering() {
  const { getInfosideText, getAppText } = useSanity();
  const kvitteringText = getInfosideText("generell-innsending.kvittering.text");

  const { dokumentkravList } = useDokumentkrav();
  const { soknadState } = useQuiz();

  return (
    <>
      <PageMeta title={getAppText("innsending-kvittering.side-metadata.tittel")} />
      <main>
        {kvitteringText && <PortableText value={kvitteringText.body} />}

        <div className="my-11">
          <Heading level="2" size="medium" spacing>
            {getAppText("generell-innsending.kvittering.dine-svar")}
          </Heading>

          {soknadState.seksjoner.map((section) => {
            return section.fakta.map((faktum) => {
              return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
            });
          })}

          <ol className={styles.dokumentkravList}>
            {dokumentkravList.krav.map((dokumentkrav) => {
              return (
                <li key={dokumentkrav.beskrivendeId}>
                  <div className={styles.dokumentkravTitle}>
                    <Heading level="3" size="xsmall">
                      <a
                        href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <DokumentkravTitle dokumentkrav={dokumentkrav} />
                      </a>
                    </Heading>

                    <Tag variant="success" className={styles.dokumentkravTag}>
                      {getAppText("kvittering.dokumenter.status.mottatt")}
                    </Tag>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref>
          <Button className="my-6" variant="primary" as="a" size="medium">
            {getAppText("generell-innsending.kvittering.knapp.mine-dagpenger")}
          </Button>
        </Link>
      </main>
    </>
  );
}
