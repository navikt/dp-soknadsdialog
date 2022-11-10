import { BodyShort, Link } from "@navikt/ds-react";
import api from "../../api.utils";
import { useSanity } from "../../context/sanity-context";
import { KVITTERING_TEKST_SENDT_AV_DEG } from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import styles from "./ReceiptDocumentsUploaded.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function ReceiptDocumentsUploadedItem({ dokumentkrav }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <div className={styles.documentItem}>
      <div>
        <Link
          href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
          rel="noreferrer"
          target="_blank"
        >
          {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
        </Link>
        <BodyShort>{getAppText(KVITTERING_TEKST_SENDT_AV_DEG)}</BodyShort>
      </div>
    </div>
  );
}
