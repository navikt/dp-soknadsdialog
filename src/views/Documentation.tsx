import React, { useState } from "react";
import { Alert, Button, Detail } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { useRouter } from "next/router";
import { Left } from "@navikt/ds-icons";
import soknadStyles from "./Soknad.module.css";
import styles from "./Dokumentasjonskrav.module.css";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../constants";
import { bundleDokumentkrav } from "../api/dokumentasjon-api";
import {
  IDokumentkrav,
  IDokumentkravChanges,
  IDokumentkravList,
} from "../types/documentation.types";
import { DokumentkravTitle } from "../components/dokumentkrav/DokumentkravTitle";
import { ErrorList, ErrorListItem } from "../components/error-list/ErrorList";
import { DokumentkravBundleErrorModal } from "../components/dokumentkrav/DokumentkravBundleErrorModal";

interface IProps {
  dokumentkravList: IDokumentkravList;
}

export function Documentation(props: IProps) {
  const router = useRouter();
  const { uuid } = router.query;

  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(
    props.dokumentkravList
  );
  const [isBundling, setIsBundling] = useState(false);
  const [showBundleError, setShowBundleError] = useState(false);
  const [bundleErrors, setBundleErrors] = useState<IDokumentkrav[]>([]);

  const [showValidationError, setShowValidationError] = useState(false);
  const [hasValidationError, setHasValidationError] = useState<IDokumentkrav[]>([]);

  const { getAppTekst, getInfosideText } = useSanity();
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");
  const numberOfDokumentkravText = getAppTekst("dokumentkrav.nummer.av.krav");
  const numberOfDokumentkrav = dokumentkravList.krav.length;

  function updateDokumentkrav(dokumentkrav: IDokumentkrav, updatedFields: IDokumentkravChanges) {
    const tempList = { ...dokumentkravList };
    const indexOfKrav = tempList.krav.findIndex((f) => f.id === dokumentkrav.id);

    if (indexOfKrav !== -1) {
      tempList.krav[indexOfKrav] = { ...dokumentkrav, ...updatedFields };
      setDokumentkravList(tempList);
    }
  }

  function validate() {
    setShowValidationError(false);
    setHasValidationError([]);

    const unAnswered = dokumentkravList.krav.filter((dokumentkrav) => {
      return !dokumentkrav.svar;
    });

    const lackingFiles = dokumentkravList.krav.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length === 0;
    });

    if (unAnswered.length > 0 || lackingFiles.length > 0) {
      setShowValidationError(true);
      setHasValidationError([...unAnswered, ...lackingFiles]);

      throw new Error();
    }
  }

  async function bundle() {
    setShowBundleError(false);
    setBundleErrors([]);

    const tempErrorList: IDokumentkrav[] = [];

    const dokumentkravToBundle = dokumentkravList.krav.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0;
    });

    if (dokumentkravToBundle.length === 0) {
      return;
    }

    setIsBundling(true);

    await Promise.all(
      dokumentkravToBundle.map(async (dokumentkrav) => {
        if (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0) {
          try {
            const response = await bundleDokumentkrav(uuid as string, dokumentkrav);
            if (!response.ok) {
              throw Error(response.statusText);
            }
          } catch {
            tempErrorList.push(dokumentkrav);
          }
        }
      })
    );

    setIsBundling(false);

    if (tempErrorList.length > 0) {
      setBundleErrors(tempErrorList);
      throw new Error();
    } else {
      return;
    }
  }

  async function bundleAndSummary() {
    setShowValidationError(false);
    setShowBundleError(false);

    try {
      validate();
    } catch {
      setShowValidationError(true);
      return;
    }

    try {
      await bundle();
      router.push(`/${router.query.uuid}/oppsummering`);
    } catch {
      setShowBundleError(true);
    }
  }

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  return (
    <>
      <ErrorList
        heading={getAppTekst("dokumentasjonskrav.feilmelding.bundling.header")}
        showWhen={showBundleError}
      >
        {bundleErrors.map((item) => {
          return (
            <ErrorListItem id={item.id} key={item.id}>
              <DokumentkravTitle dokumentkrav={item} />
            </ErrorListItem>
          );
        })}
      </ErrorList>

      <ErrorList
        heading={getAppTekst("dokumentasjonskrav.feilmelding.validering.header")}
        showWhen={showValidationError}
      >
        {hasValidationError.map((item) => {
          return (
            <ErrorListItem id={item.id} key={item.id}>
              <DokumentkravTitle dokumentkrav={item} />
            </ErrorListItem>
          );
        })}
      </ErrorList>

      {dokumentasjonskravText?.body && <PortableText value={dokumentasjonskravText.body} />}
      {dokumentkravList.krav.map((dokumentkrav, index) => {
        const dokumentkravNumber = index + 1;
        const bundleError =
          showBundleError &&
          bundleErrors.findIndex((item) => {
            return item.id === dokumentkrav.id;
          }) > -1;

        const validationError =
          hasValidationError.findIndex((item) => {
            return item.id === dokumentkrav.id;
          }) > -1;

        return (
          <div className={styles.dokumentkravContainer} key={index} id={dokumentkrav.id}>
            <Detail>{`${dokumentkravNumber} ${numberOfDokumentkravText} ${numberOfDokumentkrav}`}</Detail>
            <Dokumentkrav
              key={dokumentkrav.id}
              dokumentkrav={dokumentkrav}
              onChange={updateDokumentkrav}
              bundleError={bundleError}
              validationError={validationError}
            />
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

        <Button onClick={() => bundleAndSummary()} loading={isBundling}>
          {getAppTekst("soknad.til-oppsummering")}
        </Button>
      </nav>

      {showBundleError && <DokumentkravBundleErrorModal dokumentkravList={bundleErrors} />}
      <NoSessionModal />
    </>
  );
}
