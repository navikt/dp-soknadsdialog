import React, { useEffect, useRef, useState } from "react";
import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { ISanityAlertText } from "../../types/sanity.types";
import { IDokumentkravSvar } from "../../pages/api/documentation/svar";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../components/HelpText";
import { DokumentkravBegrunnelse } from "./DokumentkravBegrunnelse";
import { useUuid } from "../../hooks/useUuid";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { useFileUploader } from "../../hooks/useFileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileList } from "../../components/file-list/FileList";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { AlertText } from "../../components/alert-text/AlertText";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./Dokumentasjon.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
  hasUnansweredError: boolean;
  hasBundleError: boolean;
  resetError: () => void;
}

type DokumentkravError = "missingAnswer" | "missingBegrunnelse" | "missingFiles" | "bundleError";

export function DokumentkravItem(props: IProps) {
  const { dokumentkrav, hasUnansweredError, hasBundleError, resetError } = props;
  const { uuid } = useUuid();
  const { setFocus } = useSetFocus();
  const errorRef = useRef(null);

  const { saveDokumentkravSvar, updateDokumentkravList } = useDokumentkrav();
  const { remainingFilesize } = useDokumentkravRemainingFilesize(dokumentkrav);
  const { handleUploadedFiles, uploadedFiles } = useFileUploader(dokumentkrav.filer);
  const { getAppText, getDokumentkravTextById, getDokumentkravSvarTextById } = useSanity();

  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const [dokumentkravError, setDokumentkravError] = useState<DokumentkravError | undefined>();
  const [dokumentkravSvar, setDokumentkravSvar] = useState<IDokumentkravSvar | undefined>(
    dokumentkrav.svar && {
      svar: dokumentkrav.svar,
      begrunnelse: dokumentkrav.begrunnelse,
    }
  );

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (hasUnansweredError) {
      if (!dokumentkrav.svar) {
        setDokumentkravError("missingAnswer");
      } else if (dokumentkrav.svar === "dokumentkrav.svar.send.naa") {
        setDokumentkravError("missingFiles");
      } else {
        setDokumentkravError("missingBegrunnelse");
      }
    } else if (hasBundleError) {
      setDokumentkravError("bundleError");
    } else {
      dokumentkravError && setDokumentkravError(undefined);
    }
  }, [hasUnansweredError, hasBundleError]);

  useEffect(() => {
    if (dokumentkravError) {
      setFocus(errorRef);
    }
  }, [dokumentkravError]);

  useEffect(() => {
    updateDokumentkravList({
      ...dokumentkrav,
      filer: [...uploadedFiles],
    });
  }, [uploadedFiles]);

  useEffect(() => {
    resetError();

    if (dokumentkrav.svar) {
      setAlertText(getDokumentkravSvarTextById(dokumentkrav.svar)?.alertText);
    }
  }, [dokumentkrav.svar]);

  useEffect(() => {
    if (dokumentkrav.svar) {
      setDokumentkravSvar({ svar: dokumentkrav.svar, begrunnelse: dokumentkrav.begrunnelse });
    }
  }, [dokumentkrav.svar]);

  async function handleSaveDokumentkrav(value: IDokumentkravSvar) {
    setDokumentkravSvar(value);
    await saveDokumentkravSvar({ uuid, dokumentkravId: dokumentkrav.id, dokumentkravSvar: value });
  }

  return (
    <div id={dokumentkrav.id} className={styles.dokumentkravItem}>
      <Heading size="small" level="3" spacing>
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
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
          error={dokumentkravError === "missingAnswer" && getAppText("validering.faktum.ubesvart")}
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

      {dokumentkravError === "missingFiles" && (
        <div ref={errorRef}>
          <ValidationMessage message={getAppText("dokumentkrav.feilmelding.mangler-filer")} />
        </div>
      )}

      {dokumentkravError === "bundleError" && (
        <div ref={errorRef}>
          <ValidationMessage message={getAppText("dokumentkrav.feilmelding.bundle-error")} />
        </div>
      )}
    </div>
  );
}
