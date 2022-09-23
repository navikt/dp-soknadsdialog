import React, { useEffect, useState } from "react";
import { Alert, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import {
  IDokumentkrav,
  IDokumentkravChanges,
  IDokumentkravFil,
} from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import {
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  MAX_FILE_SIZE,
} from "../../constants";
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

interface IProps {
  dokumentkrav: IDokumentkrav;
  onChange: (dokumentkrav: IDokumentkrav, changes: IDokumentkravChanges) => void;
  bundleError?: boolean;
  validationError?: boolean;
}

export function Dokumentkrav(props: IProps) {
  const { dokumentkrav, onChange, bundleError, validationError } = props;

  const router = useRouter();
  const { uuid } = router.query;
  const isFirstRender = useFirstRender();

  const [svar, setSvar] = useState(dokumentkrav.svar || "");
  const [begrunnelse, setBegrunnelse] = useState(dokumentkrav.begrunnelse || "");
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(props.dokumentkrav.filer);
  const [hasError, setHasError] = useState(false);

  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const { getDokumentkravTextById, getDokumentkravSvarTextById, getAppTekst } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  const remainingFileSize = findRemainingFileSize();

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

    if (svar !== "") {
      setAlertText(getDokumentkravSvarTextById(svar)?.alertText);
    }
  }, [svar, begrunnelse, uploadedFiles]);

  async function save() {
    try {
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

  function handUploadedFiles(file: IDokumentkravFil) {
    const fileState = [...uploadedFiles];
    const indexOfFile = fileState.findIndex((f) => f.filsti === file.filsti);

    if (indexOfFile !== -1) {
      fileState.splice(indexOfFile, 1);
      setUploadedFiles(fileState);
    } else {
      setUploadedFiles((currentState) => [...currentState, file]);
    }
  }

  function findRemainingFileSize() {
    const totalUploadedFileSize = dokumentkrav.filer.map((fil) => fil.storrelse).reduce(sum, 0);

    function sum(accumulator: number, value: number) {
      return accumulator + value;
    }

    return MAX_FILE_SIZE - totalUploadedFileSize;
  }

  return (
    <div className={styles.dokumentkrav}>
      <Heading size="small" level="3" spacing>
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
      </Heading>

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}

      <div className={styles.dokumentkravSvar}>
        <RadioGroup
          legend={getAppTekst("dokumentkrav.velg.svaralternativ")}
          onChange={setSvar}
          value={svar}
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

      {alertText && <AlertText alertText={alertText} spacingTop />}

      {dokumentkravText?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={dokumentkravText.helpText} />
      )}

      {validationError && !svar && (
        <Alert variant="error">Du må svare på dokumentkravet før du kan gå videre</Alert>
      )}

      {svar === DOKUMENTKRAV_SVAR_SEND_NAA && (
        <>
          <FileUploader
            dokumentkrav={dokumentkrav}
            handleUploadedFiles={handUploadedFiles}
            maxFileSize={remainingFileSize}
          />
          <FileList
            dokumentkravId={dokumentkrav.id}
            uploadedFiles={uploadedFiles}
            handleUploadedFiles={handUploadedFiles}
          />

          {bundleError && <Alert variant="error">Feil med bundling</Alert>}

          {validationError && uploadedFiles.length === 0 && (
            <Alert variant="error">Du må laste opp filer før du kan gå videre</Alert>
          )}
        </>
      )}

      {svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
        <DokumentkravBegrunnelse begrunnelse={begrunnelse} setBegrunnelse={setBegrunnelse} />
      )}

      {hasError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </div>
  );
}
