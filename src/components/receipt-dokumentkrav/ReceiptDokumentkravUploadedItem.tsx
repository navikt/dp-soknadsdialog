import { BodyShort, Heading, Link, ReadMore, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import api from "../../api.utils";
import { useSanity } from "../../context/sanity-context";
import { KVITTERING_TEKST_SENDT_AV_DEG } from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import styles from "./ReceiptDokumentkrav.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function ReceiptDokumentkravUploadedItem({ dokumentkrav }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <div className="my-6">
      <div className={styles.dokumentkravTitle}>
        <Link
          href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
          rel="noreferrer"
          target="_blank"
        >
          <Heading level="3" size="xsmall">
            {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
          </Heading>
        </Link>
        <Tag variant="success" className={styles.dokumentkravTag}>
          {getAppText("kvittering.dokumenter.status.mottatt")}
        </Tag>
      </div>
      <BodyShort>{getAppText(KVITTERING_TEKST_SENDT_AV_DEG)}</BodyShort>

      {dokumentkravText?.helpText && (
        <ReadMore header={dokumentkravText?.helpText?.title}>
          {dokumentkravText?.helpText?.body && (
            <PortableText value={dokumentkravText.helpText.body} />
          )}
        </ReadMore>
      )}
    </div>
  );
}
