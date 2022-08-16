import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
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

export const TRIGGER_FILE_UPLOAD = "dokumentkrav.svar.send.inn.naa";
const DOKUMENTKRAV_DESCRIPTION = "faktum.arbeidsforhold.navn-bedrift";

export function Dokumentkrav(props: IProps) {
  const { dokumentkrav } = props;
  const [answer, setAnswer] = useState(dokumentkrav.svar || "");
  const [handledFiles, setHandlesFiles] = useState<IFileState[]>([]);
  const { getFaktumTextById, getSvaralternativTextById, getAppTekst } = useSanity();
  const kravText = getFaktumTextById(dokumentkrav.beskrivendeId);
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const uploadedFiles: IDokumentkravFil[] = dokumentkrav.filer || [];
  const describedBy = dokumentkrav.fakta.find((faktum) => {
    return faktum.beskrivendeId === DOKUMENTKRAV_DESCRIPTION;
  });

  useEffect(() => {
    if (answer !== "") {
      setAlertText(getSvaralternativTextById(answer)?.alertText);
    }
  }, [answer]);

  function sendDocuments() {
    alert("TODO: Send inn svar");
  }

  //TODO: Lag logikk for når svaret er "klart", altså med filer lastet opp eller med et svar som ikke krever dokumenter
  // TODO: Spinner og error handling

  return (
    <div className={styles.dokumentkrav}>
      <Heading size="small" level="3">
        {kravText ? kravText.text : dokumentkrav.beskrivendeId}{" "}
        {describedBy && `(${describedBy.svar})`}
      </Heading>

      {kravText?.description && <PortableText value={kravText.description} />}

      <RadioGroup
        legend={getAppTekst("dokumentkrav.velg.svaralternativ")}
        onChange={setAnswer}
        value={answer}
      >
        {dokumentkrav.gyldigeValg.map((textId) => {
          const svaralternativText = getSvaralternativTextById(textId);
          return (
            <div key={textId}>
              <Radio value={textId}>{svaralternativText ? svaralternativText.text : textId}</Radio>
            </div>
          );
        })}
      </RadioGroup>

      {alertText && alertText.active && <AlertText alertText={alertText} spacingTop />}

      {kravText?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={kravText.helpText} />
      )}

      {answer === TRIGGER_FILE_UPLOAD && (
        <>
          <FileUploader id={dokumentkrav.id} onHandle={setHandlesFiles} />
          <FileList previouslyUploaded={uploadedFiles} handledFiles={handledFiles} />
        </>
      )}
      {answer !== "" && <Button onClick={sendDocuments}>Send inn</Button>}
    </div>
  );
}
