import { Button } from "@navikt/ds-react";
import { useState } from "react";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { PageMeta } from "../../components/PageMeta";
import { ReceiptArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { ReceiptDokumentkrav } from "../../components/receipt-dokumentkrav/ReceiptDokumentkrav";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";
import { IDokumentkrav } from "../../types/documentation.types";
import { IOrkestratorSeksjon } from "../../types/orkestrator.types";
import { IPersonalia } from "../../types/personalia.types";
import { IQuizSeksjon, ISoknadStatus } from "../../types/quiz.types";
import {
  getMissingDokumentkrav,
  getNotSendingDokumentkrav,
  getUploadedDokumentkrav,
} from "../../utils/dokumentkrav.util";
import styles from "./Receipts.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  quizSections: IQuizSeksjon[];
  orkestratorSections: IOrkestratorSeksjon[];
  personalia: IPersonalia | null;
}

export function Receipt(props: IProps) {
  const { soknadStatus, quizSections, orkestratorSections, arbeidssokerStatus, personalia } = props;

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
      <ReceiptYourAnswers
        quizSections={quizSections}
        orkestratorSections={orkestratorSections}
        personalia={personalia}
      />

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
