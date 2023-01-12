import { useState } from "react";
import Link from "next/link";
import { BodyShort, Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { ISoknadStatus } from "../../types/quiz.types";
import { isDateWithin12Weeks } from "../../utils/date.utils";
import styles from "./ReceiptUploadDocuments.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
}

export function ReceiptUploadDocuments({ soknadStatus }: IProps) {
  const { getAppText } = useSanity();
  const { uuid } = useUuid();
  const canUseEttersending = soknadStatus.innsendt && isDateWithin12Weeks(soknadStatus.innsendt);
  const [nagivating, setNavigating] = useState(false);

  return (
    <div className="my-12">
      {canUseEttersending && (
        <Link href={`/soknad/${uuid}/ettersending`} passHref>
          <Button as="a" onClick={() => setNavigating(true)} loading={nagivating}>
            {getAppText("kvittering.mangler-dokumenter.go-til-opplasting-knapp")}
          </Button>
        </Link>
      )}

      {!canUseEttersending && (
        <>
          <BodyShort>{getAppText("kvittering.ettersending.tekst.frist-utgatt")}</BodyShort>

          <Link href={`/generell-innsending`} passHref>
            <Button as="a" className={styles.goToInnsending}>
              {getAppText("kvittering.ettersending.lenke.frist-utgatt")}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
