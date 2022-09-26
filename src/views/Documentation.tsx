import React, { useEffect, useState } from "react";
import { Alert, BodyLong, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../context/sanity-context";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { useRouter } from "next/router";
import { Left } from "@navikt/ds-icons";
import soknadStyles from "./Soknad.module.css";
import styles from "./Dokumentasjonskrav.module.css";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../constants";
import { bundleDokumentkrav, saveDokumentkravSvar } from "../api/dokumentasjon-api";
import {
  IDokumentkrav,
  IDokumentkravChanges,
  IDokumentkravList,
} from "../types/documentation.types";
import { DokumentkravTitle } from "../components/dokumentkrav/DokumentkravTitle";
import { ErrorList, ErrorListItem } from "../components/error-list/ErrorList";
import { ErrorRetryModal } from "../components/error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../types/error.types";

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

  const [isSavingFallback, setIsSavingFallback] = useState(false);
  const [savingFallbackError, setSavingFallbackError] = useState(false);

  const [unansweredDokumentkrav, setUnansweredDokumentkrav] = useState<IDokumentkrav[]>([]);

  const { getAppTekst, getInfosideText } = useSanity();
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");
  const numberOfDokumentkravText = getAppTekst("dokumentkrav.nummer.av.krav");
  const numberOfDokumentkrav = dokumentkravList.krav.length;

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  function updateDokumentkrav(dokumentkrav: IDokumentkrav, updatedFields: IDokumentkravChanges) {
    const tempList = { ...dokumentkravList };
    const indexOfKrav = tempList.krav.findIndex((f) => f.id === dokumentkrav.id);

    if (indexOfKrav !== -1) {
      tempList.krav[indexOfKrav] = { ...dokumentkrav, ...updatedFields };
      setDokumentkravList(tempList);
    }
  }

  function isAllDokumentkravAnswered(): boolean {
    setUnansweredDokumentkrav([]);

    const unAnswered = dokumentkravList.krav.filter((dokumentkrav) => {
      const requiresBegrunnelse = dokumentkrav.svar !== DOKUMENTKRAV_SVAR_SEND_NAA;

      if (!dokumentkrav.svar) {
        return true;
      } else if (requiresBegrunnelse && !dokumentkrav.begrunnelse) {
        return true;
      }
      return false;
    });

    const lackingFiles = dokumentkravList.krav.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length === 0;
    });

    if (unAnswered.length > 0 || lackingFiles.length > 0) {
      setUnansweredDokumentkrav([...unAnswered, ...lackingFiles]);

      return false;
    }
    return true;
  }

  async function bundleDokumentasjonskrav() {
    setShowBundleError(false);
    setBundleErrors([]);

    const tempErrorList: IDokumentkrav[] = [];
    const dokumentkravToBundle = dokumentkravList.krav.filter(
      (dokumentkrav) =>
        dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0
    );

    if (dokumentkravToBundle.length === 0) {
      return;
    }

    setIsBundling(true);

    await Promise.all(
      dokumentkravToBundle.map(async (dokumentkrav) => {
        try {
          const response = await bundleDokumentkrav(uuid as string, dokumentkrav);
          if (!response.ok) {
            throw Error(response.statusText);
          }
        } catch {
          tempErrorList.push(dokumentkrav);
        }
      })
    );

    setIsBundling(false);

    if (tempErrorList.length > 0) {
      setBundleErrors(tempErrorList);
      throw new Error();
    }
  }

  async function bundleAndSummary() {
    setShowBundleError(false);

    if (!isAllDokumentkravAnswered()) {
      return;
    }

    try {
      await bundleDokumentasjonskrav();
      router.push(`/${router.query.uuid}/oppsummering`);
    } catch {
      setShowBundleError(true);
    }
  }

  async function sendDocumentsLater() {
    setIsSavingFallback(true);

    try {
      await Promise.all(
        bundleErrors.map(async (dokumentkrav) => {
          const response = await saveDokumentkravSvar(uuid as string, dokumentkrav.id, {
            svar: "dokumentkrav.svar.send.senere",
            begrunnelse: "Teknisk feil på innsending av filer",
          });

          if (!response.ok) {
            throw Error(response.statusText);
          }
        })
      );

      router.push(`/${router.query.uuid}/oppsummering`);
    } catch {
      setIsSavingFallback(false);
      setSavingFallbackError(true);
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
        showWhen={unansweredDokumentkrav.length > 0}
      >
        {unansweredDokumentkrav.map((item) => (
          <ErrorListItem id={item.id} key={item.id}>
            <DokumentkravTitle dokumentkrav={item} />
          </ErrorListItem>
        ))}
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
          unansweredDokumentkrav.findIndex((item) => {
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

      <Modal
        className="modal-container"
        onClose={() => setShowBundleError(false)}
        open={showBundleError}
        shouldCloseOnOverlayClick={false}
      >
        <Modal.Content>
          <Heading size={"medium"} spacing>
            {getAppTekst("dokumentasjonskrav.feilmelding.bundling.header")}
          </Heading>
          <BodyLong>{getAppTekst("dokumentasjonskrav.feilmelding.bundling.beskrivelse")}</BodyLong>

          <ul>
            {bundleErrors.map((item) => {
              return (
                <li id={item.id} key={item.id}>
                  <DokumentkravTitle dokumentkrav={item} />
                </li>
              );
            })}
          </ul>

          <nav className={soknadStyles.navigation}>
            <Button variant={"secondary"} onClick={() => setShowBundleError(false)}>
              Avbryt
            </Button>
            <Button variant={"primary"} onClick={sendDocumentsLater} loading={isSavingFallback}>
              Send inn dokumenter senere
            </Button>
          </nav>
        </Modal.Content>
      </Modal>

      {savingFallbackError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}

      <NoSessionModal />
    </>
  );
}
