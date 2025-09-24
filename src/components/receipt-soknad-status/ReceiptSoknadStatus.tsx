import { Detail, Heading, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "../../context/sanity-context";
import { ISoknadStatus, ISoknadStatuser } from "../../types/quiz.types";
import styles from "./ReceiptSoknadStatus.module.css";
import { format } from "date-fns";

export function ReceiptSoknadStatus(props: ISoknadStatus) {
  const { getAppText, getInfosideText } = useSanity();
  const receiptDescriptionText = getInfosideText(getStatusDescriptionTextKey(props.status));

  return (
    <>
      <div className={styles.receiptSoknadTilstandHeader}>
        <Heading level="2" size="medium">
          {getAppText("kvittering.soknad-status.title.mottatt")}
        </Heading>
        {props.status !== "Ukjent" && (
          <Tag variant={getTagColor(props.status)}>
            {getAppText(getStatusTagTextKey(props.status))}
          </Tag>
        )}
      </div>

      {props.innsendt && (
        <Detail>
          {`${getAppText("kvittering.soknad-status.subtitle.innsendt-dato")} ${format(
            new Date(props.innsendt),
            "dd.MM.yyyy - HH:mm"
          )}`}
        </Detail>
      )}

      {receiptDescriptionText?.body && <PortableText value={receiptDescriptionText.body} />}
    </>
  );
}

function getStatusDescriptionTextKey(status: ISoknadStatuser) {
  switch (status) {
    case "ManglerDokumenter":
      return "kvittering.soknad-status.description.mangler-dokumenter";
    case "Ukjent":
      return "kvittering.soknad-status.description.ukjent";
    default:
      return "getStatusDescriptionTextKey() no-text-key";
  }
}

function getStatusTagTextKey(status: ISoknadStatuser) {
  if (status === "ManglerDokumenter") {
    return "kvittering.soknad-status.tag.mangler-dokumenter";
  } else {
    return "getStatusTagTextKey() no-text-key";
  }
}

function getTagColor(status: ISoknadStatuser) {
  if (status === "ManglerDokumenter") {
    return "warning";
  } else {
    return "info";
  }
}
