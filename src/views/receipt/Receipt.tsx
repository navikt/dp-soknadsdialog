import { useState } from "react";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ReceiptArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon, ISoknadStatus } from "../../types/quiz.types";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ReceiptDokumentkrav } from "../../components/receipt-dokumentkrav/ReceiptDokumentkrav";
import { IDokumentkrav } from "../../types/documentation.types";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { IPersonalia } from "../../types/personalia.types";
import styles from "./Receipts.module.css";
import {
  getMissingDokumentkrav,
  getNotSendingDokumentkrav,
  getUploadedDokumentkrav,
} from "../../utils/dokumentkrav.util";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";

interface IProps {
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
  personalia: IPersonalia | null;
}

export function Receipt(props: IProps) {
  const { soknadStatus, sections, arbeidssokerStatus, personalia } = props;

  const { getAppText } = useSanity();
  const { dokumentkravList } = useDokumentkrav();
  const [nagivating, setNavigating] = useState(false);

  const missingDocuments: IDokumentkrav[] = getMissingDokumentkrav(dokumentkravList);
  const uploadedDocuments: IDokumentkrav[] = getUploadedDokumentkrav(dokumentkravList);
  const notSendingDocuments: IDokumentkrav[] = getNotSendingDokumentkrav(dokumentkravList);

  const noDokumentkravTriggered = missingDocuments.length === 0 && uploadedDocuments.length === 0;

  function navigateToMineDagpener() {
    setNavigating(true);
    window.location.assign("https://www.nav.no/arbeid/dagpenger/mine-dagpenger");
  }

  return (
    <main id="maincontent" tabIndex={-1}>
      <PageMeta
        title={getAppText("kvittering.side-metadata.tittel")}
        description={getAppText("kvittering.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <ReceiptSoknadStatus {...soknadStatus} />
      <ReceiptArbeidssokerStatus status={arbeidssokerStatus} />

      <ReceiptDokumentkrav
        soknadStatus={soknadStatus}
        missingDocuments={missingDocuments}
        uploadedDocuments={uploadedDocuments}
        notSendingDocuments={notSendingDocuments}
      />

      {noDokumentkravTriggered && <DokumentkravGenerellInnsending classname="my-12" />}
      <ReceiptYourAnswers sections={sections} personalia={personalia} />

      <Button
        variant="primary"
        className={styles.nagivateToMineDagpengerButton}
        onClick={navigateToMineDagpener}
        loading={nagivating}
      >
        {getAppText("kvittering.mine-dagpenger.knapp")}
      </Button>
    </main>
  );
}
