import React, { useEffect, useState } from "react";
import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { IDokumentkravSvar } from "../../pages/api/documentation/svar";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../components/HelpText";
import { DokumentkravBegrunnelse } from "../../components/dokumentkrav/DokumentkravBegrunnelse";
import { useUuid } from "../../hooks/useUuid";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { useFileUploader } from "../../hooks/useFileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileList } from "../../components/file-list/FileList";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { usePrevious } from "../../hooks/usePrevious";
import { useFirstRender } from "../../hooks/useFirstRender";
import styles from "./Dokumentasjon.module.css";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../../components/alert-text/AlertText";

interface IProps {
  dokumentkrav: IDokumentkrav;
  addDokumentkravToBundle: (dokumentkrav: IDokumentkrav) => void;
  removeDokumentkravToBundle: (dokumentkrav: IDokumentkrav) => void;
  hasError: boolean;
  resetError: () => void;
}

type DokumentkravError = "missingAnswer" | "missingBegrunnelse" | "missingFiles";

export function DokumentkravItem(props: IProps) {
  const { uuid } = useUuid();
  const isFirstRender = useFirstRender();
  const {
    dokumentkrav,
    hasError,
    addDokumentkravToBundle,
    removeDokumentkravToBundle,
    resetError,
  } = props;
  const { saveDokumentkrav, getDokumentkravList } = useDokumentkrav();
  const { remainingFilesize } = useDokumentkravRemainingFilesize(dokumentkrav);
  const { handleUploadedFiles, uploadedFiles } = useFileUploader(dokumentkrav.filer);
  const { getAppText, getDokumentkravTextById, getDokumentkravSvarTextById } = useSanity();

  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const [dokumentkravError, setDokumentkravError] = useState<DokumentkravError | undefined>();
  const [dokumentkravSvar, setDokumentkravSvar] = useState<IDokumentkravSvar | undefined>({
    svar: dokumentkrav.svar,
    begrunnelse: dokumentkrav.begrunnelse,
  });

  const previousNumberOfUploadedFiles = usePrevious(uploadedFiles.length);
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (hasError) {
      if (!dokumentkrav.svar) {
        setDokumentkravError("missingAnswer");
      } else if (dokumentkrav.svar === "dokumentkrav.svar.send.naa") {
        setDokumentkravError("missingFiles");
      } else {
        setDokumentkravError("missingBegrunnelse");
      }
    } else {
      dokumentkravError && setDokumentkravError(undefined);
    }
  }, [hasError]);

  useEffect(() => {
    if (!isFirstRender) {
      saveDokumentkrav(uuid, { ...dokumentkrav, filer: uploadedFiles });
    }

    const hasOneNewFile = !previousNumberOfUploadedFiles && uploadedFiles.length > 0;
    const allFilesDeleted =
      previousNumberOfUploadedFiles &&
      previousNumberOfUploadedFiles > 0 &&
      uploadedFiles.length === 0;

    // To show/hide next dokumentkrav when uploading/deleting files we need to update the dokumentkrav list in context
    if (!isFirstRender && (hasOneNewFile || allFilesDeleted)) {
      getDokumentkravList();
    }

    if (uploadedFiles.length > 0 && dokumentkrav.svar === "dokumentkrav.svar.send.naa") {
      addDokumentkravToBundle({
        ...dokumentkrav,
        filer: [...dokumentkrav.filer, ...uploadedFiles],
      });
    } else {
      removeDokumentkravToBundle(dokumentkrav);
    }
  }, [uploadedFiles.length]);

  useEffect(() => {
    resetError();

    if (dokumentkrav.svar) {
      setAlertText(getDokumentkravSvarTextById(dokumentkrav.svar)?.alertText);
    }

    if (uploadedFiles.length > 0 && dokumentkrav.svar === "dokumentkrav.svar.send.naa") {
      addDokumentkravToBundle({
        ...dokumentkrav,
        filer: [...dokumentkrav.filer, ...uploadedFiles],
      });
    } else {
      removeDokumentkravToBundle(dokumentkrav);
    }
  }, [dokumentkrav.svar]);

  useEffect(() => {
    setDokumentkravSvar({ svar: dokumentkrav.svar, begrunnelse: dokumentkrav.begrunnelse });
  }, [dokumentkrav]);

  async function handleSaveDokumentkrav(value: IDokumentkravSvar) {
    setDokumentkravSvar(value);
    await saveDokumentkrav(uuid, { ...dokumentkrav, ...value });
  }

  return (
    <div id={dokumentkrav.id} className={styles.dokumentkravItem}>
      <Heading size="small" level="3" spacing>
        {dokumentkravText ? dokumentkravText.title : dokumentkrav.beskrivendeId}
        {dokumentkrav.beskrivelse && ` (${dokumentkrav.beskrivelse})`}
      </Heading>

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}

      {dokumentkravText?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={dokumentkravText.helpText} />
      )}

      <div className={styles.dokumentkravSvar}>
        <RadioGroup
          legend={getAppText("dokumentkrav.velg-svaralternativ")}
          onChange={(svar) => handleSaveDokumentkrav({ svar, begrunnelse: "" })}
          value={dokumentkravSvar?.svar || ""}
          error={dokumentkravError === "missingAnswer"}
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

      {(alertText?.body || alertText?.body) && <AlertText alertText={alertText} spacingBottom />}

      {dokumentkravSvar?.svar && dokumentkravSvar?.svar === DOKUMENTKRAV_SVAR_SEND_NAA && (
        <>
          <FileUploader
            dokumentkrav={dokumentkrav}
            maxFileSize={remainingFilesize}
            handleUploadedFiles={handleUploadedFiles}
          />
          <FileList
            dokumentkravId={dokumentkrav.id}
            uploadedFiles={uploadedFiles}
            handleUploadedFiles={handleUploadedFiles}
          />
        </>
      )}

      {dokumentkravSvar?.svar && dokumentkravSvar?.svar !== DOKUMENTKRAV_SVAR_SEND_NAA && (
        <DokumentkravBegrunnelse
          begrunnelse={dokumentkravSvar.begrunnelse}
          svar={dokumentkravSvar.svar}
          setBegrunnelse={(begrunnelse) =>
            handleSaveDokumentkrav({ ...dokumentkravSvar, begrunnelse })
          }
          validationError={dokumentkravError === "missingBegrunnelse"}
        />
      )}

      {dokumentkravError === "missingFiles" && <div>TODO(sanity) Du mangler filer</div>}
    </div>
  );
}