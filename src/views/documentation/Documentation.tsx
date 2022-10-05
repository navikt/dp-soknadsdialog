import React, { useState } from "react";
import { Alert, Button, Detail } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { Dokumentkrav } from "../../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../../context/sanity-context";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { useRouter } from "next/router";
import { Left } from "@navikt/ds-icons";
import styles from "./Documentation.module.css";
import {
  IDokumentkrav,
  IDokumentkravChanges,
  IDokumentkravList,
} from "../../types/documentation.types";
import { DokumentkravTitle } from "../../components/dokumentkrav/DokumentkravTitle";
import { ErrorList, ErrorListItem } from "../../components/error-list/ErrorList";
import { DokumentkravBundleErrorModal } from "../../components/dokumentkrav/DokumentkravBundleErrorModal";
import { useDokumentkravBundler } from "../../hooks/dokumentkrav/useDokumentkravBundler";
import { useDokumentkravValidation } from "../../hooks/dokumentkrav/useDokumentkravValidation";
import { useForceTrigger } from "../../hooks/useForceTrigger";

interface IProps {
  dokumentkravList: IDokumentkravList;
}

export function Documentation(props: IProps) {
  const router = useRouter();

  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(
    props.dokumentkravList
  );

  const { bundleFiles, isBundling, bundleErrors, hasBundleError } = useDokumentkravBundler();
  const { isValid, getValidationError, validationErrors } = useDokumentkravValidation();
  const { forceTrigger: triggerScroll, trigger: scroll } = useForceTrigger();

  const [showBundleErrorModal, setShowBundleErrorModal] = useState(false);

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

  async function bundleAndSummary() {
    if (isValid(dokumentkravList.krav)) {
      try {
        await bundleFiles(dokumentkravList.krav);
        router.push(`/${router.query.uuid}/oppsummering`);
      } catch {
        setShowBundleErrorModal(true);
      }
    } else {
      triggerScroll();
    }
  }

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  return (
    <>
      {validationErrors.length > 0 && (
        <ErrorList
          heading={getAppTekst("dokumentasjonskrav.feilmelding.validering.header")}
          scrollWhen={scroll}
        >
          {validationErrors.map((item) => {
            return (
              <ErrorListItem id={item.dokumentkrav.id} key={item.dokumentkrav.id}>
                <DokumentkravTitle dokumentkrav={item.dokumentkrav} />
              </ErrorListItem>
            );
          })}
        </ErrorList>
      )}

      {dokumentasjonskravText?.body && <PortableText value={dokumentasjonskravText.body} />}
      {dokumentkravList.krav.map((dokumentkrav, index) => {
        const dokumentkravNumber = index + 1;
        const validationError = getValidationError(dokumentkrav);
        const bundleError = hasBundleError(dokumentkrav);

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

      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => goToSoknad()} icon={<Left />}>
          {getAppTekst("knapp.forrige")}
        </Button>

        <Button onClick={() => bundleAndSummary()} loading={isBundling}>
          {getAppTekst("soknad.til-oppsummering")}
        </Button>
      </nav>

      <DokumentkravBundleErrorModal
        dokumentkravList={bundleErrors}
        isOpen={showBundleErrorModal}
        toggleVisibility={setShowBundleErrorModal}
      />
      <NoSessionModal />
    </>
  );
}
