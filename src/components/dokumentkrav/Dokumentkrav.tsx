import React, { useEffect, useState } from "react";
import { Alert, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import {
  IDokumentkrav,
  IDokumentkravChanges,
  IDokumentkravValidationError,
} from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { DokumentkravBegrunnelse } from "./DokumentkravBegrunnelse";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-list/FileList";
import { useFirstRender } from "../../hooks/useFirstRender";
import styles from "./Dokumentkrav.module.css";
import { saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { useRouter } from "next/router";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";
import { DokumentkravTitle } from "./DokumentkravTitle";
import { useFileUploader } from "../../hooks/useFileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";

interface IProps {
  dokumentkrav: IDokumentkrav;
  onChange: (dokumentkrav: IDokumentkrav, changes: IDokumentkravChanges) => void;
  bundleError?: boolean;
  validationError?: IDokumentkravValidationError;
}

export function Dokumentkrav({ dokumentkrav, onChange, bundleError, validationError }: IProps) {
  const router = useRouter();
  const { uuid } = router.query;
  const isFirstRender = useFirstRender();

  const [svar, setSvar] = useState(dokumentkrav.svar);
  const [hasError, setHasError] = useState(false);
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const [begrunnelse, setBegrunnelse] = useState(dokumentkrav.begrunnelse || "");
  const { remainingFilesize } = useDokumentkravRemainingFilesize(dokumentkrav);
  const { uploadedFiles, handleUploadedFiles } = useFileUploader(dokumentkrav.filer);
  const { getDokumentkravTextById, getDokumentkravSvarTextById, getAppText } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (!isFirstRender) {
      setHasError(false);

      const shouldTriggerSave =
        dokumentkrav.svar !== svar || dokumentkrav.begrunnelse !== begrunnelse;

      if (shouldTriggerSave) {
        save();
      }

      onChange(dokumentkrav, { svar, begrunnelse, filer: uploadedFiles });
    }

    if (svar) {
      setAlertText(getDokumentkravSvarTextById(svar)?.alertText);
    }
  }, [svar, begrunnelse, uploadedFiles]);

  async function save() {
    try {
      if (!svar) {
        throw new Error("Mangler svar");
      }

      const response = await saveDokumentkravSvar(uuid as string, dokumentkrav.id, {
        svar,
        begrunnelse,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }
    } catch (error) {
      setHasError(true);
    }
  }

  return (
    <div className={styles.dokumentkrav}>
      <Heading size="small" level="3" spacing>
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
      </Heading>

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}

      <div className={styles.dokumentkravSvar}>
        <RadioGroup
          legend={getAppText("dokumentkrav.velg-svaralternativ")}
          onChange={setSvar}
          value={svar}
          error={
            validationError?.errorType === "svar" &&
            !svar &&
            getAppText("dokumentkrav.feilmelding.mangler-svaralternativ")
          }
        >
          {dokumentkrav.gyldigeValg.map((textId) => {
            // We need a custom ID since multiple dokumentkrav are shown on the same page.
            // The radio buttons as such need a more unique ID than the textId (used once per dokumentkrav).
            const id = `${dokumentkrav.id}-${textId}`;
            const svaralternativText = getDokumentkravSvarTextById(textId);
            return (
              <div key={textId}>
                <Radio value={textId} id={id}>
                  {svaralternativText ? svaralternativText.text : textId}
                </Radio>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {(alertText?.title || alertText?.body) && <AlertText alertText={alertText} spacingBottom />}

      {dokumentkravText?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={dokumentkravText.helpText} />
      )}

      {svar === DOKUMENTKRAV_SVAR_SEND_NAA && (
        <>
          <FileUploader
            dokumentkrav={dokumentkrav}
            handleUploadedFiles={handleUploadedFiles}
            maxFileSize={remainingFilesize}
          />
          <FileList
            dokumentkravId={dokumentkrav.id}
            uploadedFiles={uploadedFiles}
            handleUploadedFiles={handleUploadedFiles}
          />

          {bundleError && (
            <Alert variant="error">
              {getAppText("dokumentkrav.feilmelding.klarte-ikke-bundle")}
            </Alert>
          )}

          {validationError?.errorType === "filer" && uploadedFiles.length === 0 && (
            <Alert variant="error">{getAppText("dokumentkrav.feilmelding.mangler-filer")}</Alert>
          )}
        </>
      )}

      {svar && svar !== DOKUMENTKRAV_SVAR_SEND_NAA && (
        <DokumentkravBegrunnelse
          begrunnelse={begrunnelse}
          svar={svar}
          setBegrunnelse={setBegrunnelse}
          validationError={validationError}
        />
      )}

      {hasError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </div>
  );
}
