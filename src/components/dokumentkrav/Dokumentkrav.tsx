import React, { useEffect, useState } from "react";
import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import {
  ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID,
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  MAX_FILE_SIZE,
} from "../../constants";
import { DokumentkravBegrunnelse } from "./DokumentkravBegrunnelse";
import { saveDokumentkravBegrunnelse, saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { useRouter } from "next/router";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-list/FileList";
import { useFirstRender } from "../../hooks/useFirstRender";
import styles from "./Dokumentkrav.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function Dokumentkrav(props: IProps) {
  const router = useRouter();
  const isFirstRender = useFirstRender();
  const { dokumentkrav } = props;

  const [svar, setSvar] = useState(dokumentkrav.svar || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(props.dokumentkrav.filer);
  const { getDokumentkravTextById, getDokumentkravSvarTextById, getAppTekst } = useSanity();

  const uuid = router.query.uuid as string;
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
  const employerName = dokumentkrav.fakta.find(
    (faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID
  )?.svar;

  const totalUploadedFileSize = dokumentkrav.filer
    .map((fil) => fil.storrelse)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  const remainingFileSize = MAX_FILE_SIZE - totalUploadedFileSize;

  useEffect(() => {
    const save = async () => {
      try {
        await saveDokumentkravSvar(uuid, dokumentkrav, svar);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    if (!isFirstRender) {
      save();
    }

    if (svar !== "") {
      setAlertText(getDokumentkravSvarTextById(svar)?.alertText);
    }
  }, [svar]);

  function handUploadedFiles(file: IDokumentkravFil) {
    setUploadedFiles((currentState) => [...currentState, file]);
  }

  return (
    <div className={styles.dokumentkrav}>
      <Heading size="small" level="3" spacing>
        {dokumentkravText ? dokumentkravText.text : dokumentkrav.beskrivendeId}
        {employerName && ` (${employerName})`}
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
            const svaralternativText = getDokumentkravTextById(textId);
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

      {svar === DOKUMENTKRAV_SVAR_SEND_NAA && (
        <>
          <FileUploader
            dokumentkrav={dokumentkrav}
            setUploadedFiles={handUploadedFiles}
            maxFileSize={remainingFileSize}
          />
          <FileList uploadedFiles={uploadedFiles} />
        </>
      )}

      {svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
        <DokumentkravBegrunnelse
          begrunnelse={dokumentkrav.begrunnelse}
          onChange={(value) => saveDokumentkravBegrunnelse(uuid, dokumentkrav, value)}
        />
      )}
    </div>
  );
}
