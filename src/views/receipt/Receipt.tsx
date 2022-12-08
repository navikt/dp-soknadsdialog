import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./Receipts.module.css";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ReceiptDokumentkrav } from "../../components/receipt-dokumentkrav/ReceiptDokumentkrav";
import { IPersonalia } from "../../types/personalia.types";

interface IProps {
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
  personalia: IPersonalia | null;
}

export function Receipt(props: IProps) {
  const { soknadStatus, arbeidssokerStatus, sections, personalia } = props;

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
      <ReceiptSoknadStatus {...soknadStatus} />
      <ArbeidssokerStatus status={arbeidssokerStatus} />

      <ReceiptDokumentkrav soknadStatus={soknadStatus} />

      <DokumentkravGenerellInnsending classname="my-12" />

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
