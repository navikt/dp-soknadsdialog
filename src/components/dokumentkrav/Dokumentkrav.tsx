import React, { useEffect, useState } from "react";
import { Alert, Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { IDokumentkrav, IUploadedFile, IFileState } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-uploader/FileList";
import api from "../../api.utils";
import { useRouter } from "next/router";
import styles from "./dokumentkrav.module.css";
import { useSanity } from "../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../HelpText";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export const TRIGGER_FILE_UPLOAD = "dokumentkrav.send.inn.na";

export function Dokumentkrav(props: IProps) {
  const { dokumentkrav } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [answer, setAnswer] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);
  const [handledFiles, setHandlesFiles] = useState<IFileState[]>([]);
  const { getFaktumTextById, getSvaralternativTextById, getAppTekst } = useSanity();
  const kravText = getFaktumTextById(dokumentkrav.beskrivendeId);

  useEffect(() => {
    loadDokumentkrav();
  }, []);

  async function loadDokumentkrav() {
    setIsLoading(true);

    const url = api(`/documentation/${router.query.uuid}/${dokumentkrav.id}`);

    try {
      const response = await fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw Error(res.statusText);
          }

          return res;
        })
        .then((res) => res.json());
      setUploadedFiles(response);
      setIsLoading(false);
    } catch {
      setIsError(true);
    }
  }

  function sendDocuments() {
    alert("TODO: Send inn svar");
  }

  //TODO: Lag logikk for når svaret er "klart", altså med filer lastet opp eller med et svar som ikke krever dokumenter
  // TODO: Spinner og error handling

  return (
    <div className={styles.dokumentkrav}>
      {isLoading && <span>Laster</span>}
      {isError && <Alert variant="error">Det skjedde noe feil</Alert>}

      {!isLoading && !isError && (
        <>
          <Heading size="small" level="3">
            {kravText ? kravText.text : dokumentkrav.beskrivendeId}
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
                  <Radio value={textId}>
                    {svaralternativText ? svaralternativText.text : textId}
                  </Radio>
                </div>
              );
            })}
          </RadioGroup>

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
        </>
      )}
    </div>
  );
}
