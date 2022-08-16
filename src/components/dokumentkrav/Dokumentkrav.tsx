import React, { useEffect, useState } from "react";
import { Alert, Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { IDokumentkrav, IUploadedFile, IFileState } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-uploader/FileList";
import api from "../../api.utils";
import { useRouter } from "next/router";
import styles from "./Dokumentkrav.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function Dokumentkrav({ dokumentkrav }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [answer, setAnswer] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);
  const [handledFiles, setHandlesFiles] = useState<IFileState[]>([]);

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
            {dokumentkrav.beskrivendeId}
          </Heading>

          <RadioGroup legend="Velg hva du vil gjøre" onChange={setAnswer} value={answer}>
            <Radio value="upload_now">Laste opp nå</Radio>
            <Radio value="upload_later">Laste opp senere</Radio>
            <Radio value="somebody_else_sends">Noen andre sender dokumentet</Radio>
            <Radio value="already_sent">Har sendt tidligere</Radio>
            <Radio value="will_not_send">Sender ikke</Radio>
          </RadioGroup>

          {answer === "upload_now" && (
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
