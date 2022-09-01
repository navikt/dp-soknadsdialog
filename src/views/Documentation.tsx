import { Alert, Button, Detail } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { IDokumentkravListe } from "../types/documentation.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import styles from "./Dokumentasjonskrav.module.css";
import soknadStyles from "./Soknad.module.css";
import { useRouter } from "next/router";
import { Left } from "@navikt/ds-icons";

interface IProps {
  dokumentasjonskravList: IDokumentkravListe;
}

export function Documentation(props: IProps) {
  const router = useRouter();
  const { dokumentasjonskravList } = props;
  const { getAppTekst, getInfosideText } = useSanity();
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");

  function goToSummary() {
    router.push(`/${router.query.uuid}/oppsummering`);
  }

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  return (
    <>
      {dokumentasjonskravText?.body && <PortableText value={dokumentasjonskravText.body} />}
      {dokumentasjonskravList.krav.map((dokumentkrav, index) => {
        const formattedCounter = `${index + 1} ${getAppTekst("dokumentkrav.nummer.av.krav")} ${
          dokumentasjonskravList.krav.length
        }`;

        return (
          <div className={styles.dokumentkravContainer} key={index}>
            <Detail key={`${dokumentkrav.id}-detail`}>{formattedCounter}</Detail>
            <Dokumentkrav key={dokumentkrav.id} dokumentkrav={dokumentkrav} />
          </div>
        );
      })}

      {dokumentasjonskravList.krav.length === 0 && (
        <Alert variant="info" size="medium">
          {getAppTekst("dokumentasjonskrav.ingen.krav.funnet")}
        </Alert>
      )}

      <nav className={soknadStyles.navigation}>
        <Button variant={"secondary"} onClick={() => goToSoknad()} icon={<Left />}>
          {getAppTekst("knapp.forrige")}
        </Button>

        <Button onClick={() => goToSummary()}>{getAppTekst("soknad.til-oppsummering")}</Button>
      </nav>

      <NoSessionModal />
    </>
  );
}
