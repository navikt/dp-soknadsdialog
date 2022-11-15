import { BodyShort, Button } from "@navikt/ds-react";
import { addWeeks, isBefore } from "date-fns";
import Link from "next/link";
import React from "react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import {
  KVITTERING_ETTERSENDING_FRIST_UTGATT_LENKE,
  KVITTERING_ETTERSENDING_FRIST_UTGATT_TEKST,
  KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP,
} from "../../text-constants";
import styles from "./ReceiptUploadDocuments.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
}

export function ReceiptUploadDocuments({ soknadStatus }: IProps) {
  const { getAppText } = useSanity();
  const { uuid } = useUuid();

  function within12Weeks() {
    if (!soknadStatus.innsendt) {
      return false;
    }

    const innsendtDate = new Date(soknadStatus.innsendt);
    const today = new Date();
    const endDate = addWeeks(innsendtDate, 12);
    return isBefore(today, endDate);
  }

  const canUploadDocuments = within12Weeks();

  return (
    <>
      {canUploadDocuments && (
        <Link href={`/${uuid}/ettersending`} passHref>
          <Button as="a">{getAppText(KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP)}</Button>
        </Link>
      )}

      {!canUploadDocuments && (
        <div>
          <BodyShort>{getAppText(KVITTERING_ETTERSENDING_FRIST_UTGATT_TEKST)}</BodyShort>

          <Link href={`/${uuid}/innsending`} passHref>
            <Button as="a" className={styles.goToInnsending}>
              {getAppText(KVITTERING_ETTERSENDING_FRIST_UTGATT_LENKE)}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
