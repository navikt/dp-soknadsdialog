import React, { useRef, useState, useEffect } from "react";
import { Alert, Button, Detail } from "@navikt/ds-react";
import { Left } from "@navikt/ds-icons";
import { PortableText } from "@portabletext/react";
import { Dokumentkrav } from "../../components/dokumentkrav/Dokumentkrav";
import { useSanity } from "../../context/sanity-context";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { useRouter } from "next/router";
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
import { useNumberOfSoknadSteps } from "../../hooks/useNumberOfSoknadSteps";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { ProgressBar } from "../../components/ProgressBar";
import { useQuiz } from "../../context/quiz-context";
import styles from "./Documentation.module.css";
import { PageMeta } from "../../components/PageMeta";
import { useSetFocus } from "../../hooks/useSetFocus";

interface IProps {
  dokumentkravList: IDokumentkravList;
}

export function Documentation(props: IProps) {
  const router = useRouter();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showBundleErrorModal, setShowBundleErrorModal] = useState(false);
  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(
    props.dokumentkravList
  );

  const { soknadState } = useQuiz();
  const { scrollIntoView } = useScrollIntoView();
  const { setFocus } = useSetFocus();
  const { getAppText, getInfosideText } = useSanity();
  const { numberOfSoknadSteps } = useNumberOfSoknadSteps();
  const { isValid, getValidationError, validationErrors } = useDokumentkravValidation();
  const { bundleFiles, isBundling, bundleErrors, hasBundleError } = useDokumentkravBundler();

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const dokumentasjonskravText = getInfosideText("dokumentasjonskrav");
  const numberOfDokumentkravText = getAppText("dokumentkrav.antall-krav-av");
  const numberOfDokumentkrav = dokumentkravList.krav.length;

  useEffect(() => {
    if (showValidationErrors) {
      scrollIntoView(errorSummaryRef);
      setFocus(errorSummaryRef);
    }
  }, [showValidationErrors]);

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
      setShowValidationErrors(true);

      // If showValidationErrors is false, the async useEffect will trigger
      // a scroll as soon as the state is set (and the validation error element is in view)
      if (showValidationErrors) {
        scrollIntoView(errorSummaryRef);
        setFocus(errorSummaryRef);
      }
    }
  }

  function navigateToSoknad() {
    const lastSectionIndex = soknadState.seksjoner.length;
    router.push(`/${router.query.uuid}?seksjon=${lastSectionIndex}`);
  }

  return (
    <>
      <PageMeta
        title={getAppText("dokumentkrav.side-metadata.tittel")}
        description={getAppText("dokumentkrav.side-metadata.meta-beskrivelse")}
      />
      <ProgressBar currentStep={12} totalSteps={numberOfSoknadSteps} />
      {showValidationErrors && (
        <ErrorList
          heading={getAppText("dokumentkrav.feilmelding.validering.header")}
          ref={errorSummaryRef}
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
          {getAppText("dokumentasjonskrav.ingen.krav.funnet")}
        </Alert>
      )}
      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => navigateToSoknad()} icon={<Left />}>
          {getAppText("soknad.knapp.forrige-steg")}
        </Button>

        <Button onClick={() => bundleAndSummary()} loading={isBundling}>
          {getAppText("soknad.knapp.til-oppsummering")}
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
