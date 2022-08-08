import React, { useEffect, useState } from "react";
import { Button, Heading } from "@navikt/ds-react";
import { DocumentItem, UploadedFile, DocumentationAnswers } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { ListFiles } from "../file-uploader/ListFiles";
import api from "../../api.utils";
import { useRouter } from "next/router";
import { DocumentQuestions } from "./DocumentQuestions";

interface Props {
  documentItem: DocumentItem;
}

export function DocumentItem({ documentItem }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState(false);
  const [answers, setAnswers] = useState<DocumentationAnswers>({});
  const [uploadedFiles, setuploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    setIsLoading(true);

    const url = api(`/documentation/${router.query.uuid}/${documentItem.id}`);

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setuploadedFiles(res);
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
    <>
      <Heading size="small" level="3">
        {documentItem.beskrivendeId}
      </Heading>

      <DocumentQuestions setAnswers={setAnswers}>
        <FileUploader id={documentItem.id} filer={uploadedFiles} onUpload={setuploadedFiles} />
        <ListFiles files={uploadedFiles} />

        {answers?.sendeInn !== "" && answers?.hvemSender !== "" && (
          <Button onClick={sendDocuments}>Send inn</Button>
        )}
      </DocumentQuestions>
    </>
  );
}
