import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { IDokumentkrav, IFileState, IDokumentkravFil } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-uploader/FileList";
import styles from "./dokumentkrav.module.css";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";
import { ISanityAlertText } from "../../types/sanity.types";
import { AlertText } from "../AlertText";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export const TRIGGER_FILE_UPLOAD = "dokumentkrav.svar.send.naa";
const DOKUMENTKRAV_DESCRIPTION = "faktum.arbeidsforhold.navn-bedrift";
const TRIGGER_BEGRUNNELSE = "dokumentkrav.svar.sender.ikke";

export function Dokumentkrav(props: IProps) {
  const { dokumentkrav } = props;
  const [svar, setSvar] = useState(dokumentkrav.svar || "");
  const [handledFiles, setHandlesFiles] = useState<IFileState[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [begrunnelse, setBegrunnelse] = useState(dokumentkrav.begrunnelse || "");
  const { getFaktumTextById, getSvaralternativTextById, getAppTekst } = useSanity();
  const kravText = getFaktumTextById(dokumentkrav.beskrivendeId);
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const uploadedFiles: IDokumentkravFil[] = dokumentkrav.filer || [];
  const describedBy = dokumentkrav.fakta.find((faktum) => {
    return faktum.beskrivendeId === DOKUMENTKRAV_DESCRIPTION;
  });

  useEffect(() => {
    if (svar !== "") {
      setAlertText(getSvaralternativTextById(svar)?.alertText);
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
        {kravText ? kravText.text : dokumentkrav.beskrivendeId}{" "}
        {describedBy && `(${describedBy.svar})`}
      </Heading>

      {kravText?.description && <PortableText value={kravText.description} />}

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
                <Radio value={textId}>
                  {svaralternativText ? svaralternativText.text : textId}
                </Radio>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {alertText && alertText.active && <AlertText alertText={alertText} spacingTop />}

      {kravText?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={kravText.helpText} />
      )}

      {svar === TRIGGER_FILE_UPLOAD && (
        <>
          <FileUploader id={dokumentkrav.id} onHandle={setHandlesFiles} />
          <FileList previouslyUploaded={uploadedFiles} handledFiles={handledFiles} />
        </>
      )}

      {svar === TRIGGER_BEGRUNNELSE && (
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

      {svar !== "" && (
        <div className={styles.dokumentkravSend}>
          <Button onClick={sendDocuments}>Send inn</Button>
        </div>
      )}
    </div>
  );
}
