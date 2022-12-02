import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon, ISoknadStatus } from "../../types/quiz.types";
import { IArbeidssokerStatus } from "../../api/arbeidssoker-api";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./Receipts.module.css";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ReceiptDokumentkrav } from "../../components/receipt-dokumentkrav/ReceiptDokumentkrav";

interface IProps {
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
}

export function Receipt(props: IProps) {
  const { getAppText } = useSanity();

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
      <ReceiptSoknadStatus {...props.soknadStatus} />
      <ArbeidssokerStatus status={props.arbeidssokerStatus} />

      <ReceiptDokumentkrav soknadStatus={props.soknadStatus} />

      <DokumentkravGenerellInnsending classname="my-12" />

      <ReceiptYourAnswers sections={props.sections} />
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
