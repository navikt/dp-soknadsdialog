import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { DocumentListItem, UploadedFile, FileState } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../file-uploader/FileList";
import api from "../../api.utils";
import { useRouter } from "next/router";
import styles from "./DocumentItem.module.css";

interface Props {
  documentItem: DocumentListItem;
}

export function DocumentItem({ documentItem }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [handledFiles, setHandlesFiles] = useState<FileState[]>([]);

  useEffect(() => {
    setIsLoading(true);

    const url = api(`/documentation/${router.query.uuid}/${documentItem.id}`);

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setUploadedFiles(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  function sendDocuments() {
    alert("TODO: Send inn svar");
  }

  //TODO: Lag logikk for når svaret er "klart", altså med filer lastet opp eller med et svar som ikke krever dokumenter
  // TODO: Spinner og error handling

  return (
    <div className={styles.documentItem}>
      {isLoading && <span>Laster</span>}

      {!isLoading && (
        <>
          <Heading size="small" level="3">
            {documentItem.beskrivendeId}
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
              <FileUploader id={documentItem.id} onHandle={setHandlesFiles} />
              <FileList previouslyUploaded={uploadedFiles} handledFiles={handledFiles} />
            </>
          )}
          {answer !== "" && <Button onClick={sendDocuments}>Send inn</Button>}
        </>
      )}
    </div>
  );
}
