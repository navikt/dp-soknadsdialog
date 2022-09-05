import React from "react";
import { Alert, Button, Detail } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { IDokumentkravList } from "../types/documentation.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { useRouter } from "next/router";
import { Left } from "@navikt/ds-icons";
import soknadStyles from "./Soknad.module.css";
import styles from "./Dokumentasjonskrav.module.css";

interface IProps {
  dokumentkravList: IDokumentkravList;
}

export function Documentation(props: IProps) {
  const router = useRouter();
  const { dokumentkravList } = props;
  const { getAppTekst, getInfosideText } = useSanity();
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");
  const numberOfDokumentkravText = getAppTekst("dokumentkrav.nummer.av.krav");
  const numberOfDokumentkrav = dokumentkravList.krav.length;

  function goToSummary() {
    router.push(`/${router.query.uuid}/oppsummering`);
  }

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  return (
    <>
      {dokumentasjonskravText?.body && <PortableText value={dokumentasjonskravText.body} />}
      {dokumentkravList.krav.map((dokumentkrav, index) => {
        const dokumentkravNumber = index + 1;

        return (
          <div className={styles.dokumentkravContainer} key={index}>
            <Detail>{`${dokumentkravNumber} ${numberOfDokumentkravText} ${numberOfDokumentkrav}`}</Detail>
            <Dokumentkrav key={dokumentkrav.id} dokumentkrav={dokumentkrav} />
          </div>
        );
      })}

      {dokumentkravList.krav.length === 0 && (
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
