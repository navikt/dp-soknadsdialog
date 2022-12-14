import React from "react";
import Link from "next/link";
import { BodyShort, Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { ISoknadStatus } from "../../types/quiz.types";
import {
  KVITTERING_ETTERSENDING_FRIST_UTGATT_LENKE,
  KVITTERING_ETTERSENDING_FRIST_UTGATT_TEKST,
  KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP,
} from "../../text-constants";
import { isDateWithin12Weeks } from "../../utils/date.utils";
import styles from "./ReceiptUploadDocuments.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
}

export function ReceiptUploadDocuments({ soknadStatus }: IProps) {
  const { getAppText } = useSanity();
  const { uuid } = useUuid();
  const canUseEttersending = soknadStatus.innsendt && isDateWithin12Weeks(soknadStatus.innsendt);

  return (
    <div className="my-12">
      {canUseEttersending && (
        <Link href={`/soknad/${uuid}/ettersending`} passHref>
          <Button as="a">{getAppText(KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP)}</Button>
        </Link>
      )}

      {!canUseEttersending && (
        <>
          <BodyShort>{getAppText(KVITTERING_ETTERSENDING_FRIST_UTGATT_TEKST)}</BodyShort>

          <Link href={`/generell-innsending`} passHref>
            <Button as="a" className={styles.goToInnsending}>
              {getAppText(KVITTERING_ETTERSENDING_FRIST_UTGATT_LENKE)}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
