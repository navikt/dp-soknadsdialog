import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon, ISoknadStatus } from "../../types/quiz.types";
import { IArbeidssokerStatus } from "../../api/arbeidssoker-api";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ReceiptDokumentkrav } from "../../components/receipt-dokumentkrav/ReceiptDokumentkrav";
import { IDokumentkrav } from "../../types/documentation.types";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { IPersonalia } from "../../types/personalia.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import styles from "./Receipts.module.css";

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
  const missingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE ||
      (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !dokumentkrav.bundleFilsti)
  );

  const uploadedDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) => dokumentkrav.bundleFilsti
  );

  const notSendingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  );

  const noDokumentkravTriggered = missingDocuments.length === 0 && uploadedDocuments.length === 0;

  function navigateToMineDagpener() {
    window.location.assign("https://www.nav.no/arbeid/dagpenger/mine-dagpenger");
  }

  return (
    <main>
      <PageMeta
        title={getAppText("kvittering.side-metadata.tittel")}
        description={getAppText("kvittering.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <ReceiptSoknadStatus {...soknadStatus} />
      <ArbeidssokerStatus status={arbeidssokerStatus} />

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
      >
        {getAppText("kvittering.mine-dagpenger.knapp")}
      </Button>
      <NoSessionModal />
    </main>
  );
}
