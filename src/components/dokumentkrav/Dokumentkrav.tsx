import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
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
import { bundleDokumentkrav, saveDokumentkravSvar } from "../../api/dokumentasjon-api";
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
  const [begrunnelse, setBegrunnelse] = useState(dokumentkrav.begrunnelse || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(props.dokumentkrav.filer);
  const { getDokumentkravTextById, getDokumentkravSvarTextById, getAppTekst } = useSanity();

  const uuid = router.query.uuid as string;
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
  const employerName = dokumentkrav.fakta.find(
    (faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID
  )?.svar;

  const totalUploadedFileSize = dokumentkrav.filer.map((fil) => fil.storrelse).reduce(sum, 0);
  const remainingFileSize = MAX_FILE_SIZE - totalUploadedFileSize;

  function sum(accumulator: number, value: number) {
    return accumulator + value;
  }

  useEffect(() => {
    const save = async () => {
      try {
        const response = await saveDokumentkravSvar(uuid, dokumentkrav, { svar, begrunnelse });

        if (!response.ok) {
          // eslint-disable-next-line no-console
          console.log("Feil ved lagring av dokumentkrav svar");
        }
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
  }, [svar, begrunnelse]);

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

  async function bundle() {
    const res = await bundleDokumentkrav(uuid, dokumentkrav);
    // eslint-disable-next-line no-console
    console.log("Vi bundler!", res);
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
        </>
      )}

      <Button onClick={bundle}>Bundle test</Button>

      {svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
        <DokumentkravBegrunnelse begrunnelse={begrunnelse} setBegrunnelse={setBegrunnelse} />
      )}
    </div>
  );
}
