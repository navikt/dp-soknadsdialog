import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { IPaabegyntSoknad } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import styles from "./inngangPaabegynt.module.css";

interface IProps {
  paabegynt: IPaabegyntSoknad;
}
export function InngangPaabegynt({ paabegynt }: IProps) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.inngangPaabegyntContainer}>
      <BodyLong>
        {getAppText("inngang.paabegyntsoknad.header.du-har-en-paabegynt")}{" "}
        <FormattedDate date={paabegynt.sistEndretAvbruker ?? paabegynt.opprettet} />.{" "}
        {getAppText("inngang.paabegyntsoknad.header.fortsett-eller-starte-ny")}
      </BodyLong>
      <Link href={paabegynt.soknadUuid} passHref>
        <Button variant="primary" as="a">
          {getAppText("inngang.paabegyntsoknad.fortsett-paabegynt-knapp")}
        </Button>
      </Link>
      <Link href="/arbeidssoker" passHref>
        <Button variant="secondary" as="a">
          {getAppText("inngang.paabegyntsoknad.start-en-ny-knapp")}
        </Button>
      </Link>
    </div>
  );
}
