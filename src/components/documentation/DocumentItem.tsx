import React, { useEffect, useState } from "react";
import { Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { DocumentItem, UploadedFile } from "../../types/documentation.types";
import { FileUploader } from "../file-uploader/FileUploader";
import { ListFiles } from "../file-uploader/ListFiles";
import api from "../../api.utils";
import { useRouter } from "next/router";

interface Props {
  documentItem: DocumentItem;
}

export function DocumentItem({ documentItem }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState(false);
  const [sendeInnSpm, setSendeInnSpm] = useState("");
  const [hvemSenderSpm, setHvemSenderSpm] = useState("");
  const [uploadedFiles, setuploadedFiles] = useState<UploadedFile[]>([]);
  const mellomlagringId = `${router.query.uuid}-${documentItem.id}`;

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

  const selectSendeInn = (val: string) => {
    setSendeInnSpm(val);
  };

  const selectHvemSender = (val: string) => {
    setHvemSenderSpm(val);
  };

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

      <RadioGroup
        legend="Skal du sende dokumentet nå?"
        onChange={selectSendeInn}
        value={sendeInnSpm}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>

      {sendeInnSpm && (
        <RadioGroup
          legend="Hvem skal sende dette dokumentet?"
          onChange={selectHvemSender}
          value={hvemSenderSpm}
        >
          <Radio value="meg">Jeg</Radio>
          <Radio value="noenAndre">Noen andre sender</Radio>
          <Radio value={false}>Det har blitt sendt med en tidligere søknad</Radio>
        </RadioGroup>
      )}

      {sendeInnSpm === "ja" && hvemSenderSpm === "meg" && (
        <>
          <FileUploader id={mellomlagringId} filer={uploadedFiles} onUpload={setuploadedFiles} />
          <ListFiles files={uploadedFiles} />
        </>
      )}

      {sendeInnSpm !== "" && hvemSenderSpm !== "" && (
        <Button onClick={sendDocuments}>Send inn</Button>
      )}
    </>
  );
}
