import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { IDokumentkrav, IFileState } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-uploader/FileList";
import styles from "./Dokumentkrav.module.css";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import {
  ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID,
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
} from "../../constants";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function Dokumentkrav(props: IProps) {
  const { dokumentkrav } = props;
  const { getFaktumTextById, getSvaralternativTextById, getDokumentkravSvarTextById, getAppTekst } =
    useSanity();
  const [svar, setSvar] = useState(dokumentkrav.svar || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [begrunnelse, setBegrunnelse] = useState(dokumentkrav.begrunnelse || ""); //TODO: Fjern eslint-disable når vi tar variabelen begrunnelse i bruk
  const [handledFiles, setHandlesFiles] = useState<IFileState[]>([]);

  const dokumentkravText = getFaktumTextById(dokumentkrav.beskrivendeId);
  const uploadedFiles = dokumentkrav.filer || [];
  const employerName = dokumentkrav.fakta.find(
    (faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID
  )?.svar;

  useEffect(() => {
    if (svar !== "") {
      setAlertText(getDokumentkravSvarTextById(svar)?.alertText);
    }
  }, [svar]);

  function sendDocuments() {
    alert("TODO: Send inn svar");
  }

  //TODO: Lag logikk for når svaret er "klart", altså med filer lastet opp eller med et svar som ikke krever dokumenter
  // TODO: Spinner og error handling

  return (
    <div className={styles.dokumentkrav}>
      <Heading size="small" level="3" spacing>
        {dokumentkravText ? dokumentkravText.text : dokumentkrav.beskrivendeId}{" "}
        {employerName && `(${employerName})`}
      </Heading>

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}

      <div className={styles.dokumentkravSvar}>
        <RadioGroup
          legend={getAppTekst("dokumentkrav.velg.svaralternativ")}
          onChange={setSvar}
          value={svar}
        >
          {dokumentkrav.gyldigeValg.map((textId) => {
            const svaralternativText = getSvaralternativTextById(textId);
            return (
              <div key={textId}>
                <Radio value={textId} id={textId}>
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
          <FileUploader dokumentkravId={dokumentkrav.id} onHandle={setHandlesFiles} />
          <FileList previouslyUploaded={uploadedFiles} handledFiles={handledFiles} />
        </>
      )}

      {svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
        <div className={styles.dokumentkravBegrunnelse}>
          <TextField
            defaultValue={dokumentkrav.begrunnelse}
            label={getAppTekst("dokumentkrav.sender.ikke.begrunnelse")}
            size="medium"
            type="text"
            onChange={(event) => setBegrunnelse(event?.currentTarget.value)}
          />
        </div>
      )}

      {svar && (
        <div className={styles.dokumentkravSend}>
          <Button onClick={sendDocuments}>Send inn</Button>
        </div>
      )}
    </div>
  );
}
