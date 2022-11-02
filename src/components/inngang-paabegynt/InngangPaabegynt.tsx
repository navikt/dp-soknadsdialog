import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ErrorTypesEnum } from "../../types/error.types";
import { IPaabegyntSoknad } from "../../types/quiz.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { FormattedDate } from "../FormattedDate";
import styles from "./inngangPaabegynt.module.css";

interface IProps {
  paabegynt: IPaabegyntSoknad;
  arbeidssokerStatus: IArbeidssokerStatus;
}
export function InngangPaabegynt({ paabegynt, arbeidssokerStatus }: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const [isLoading, setIsLoading] = useState(false);
  const [hasDeleteSoknadError, setHasDeleteSoknadError] = useState(false);

  const destinationPage = arbeidssokerStatus === "REGISTERED" ? "/start-soknad" : "/arbeidssoker";

  async function deleteSoknadAndNavigateToPage() {
    setIsLoading(true);
    const deleteSoknadResponse = await deleteSoknad(paabegynt.soknadUuid);

    if (deleteSoknadResponse.ok) {
      router.push(destinationPage);
    } else {
      setHasDeleteSoknadError(true);
      setIsLoading(false);
      throw new Error(deleteSoknadResponse.statusText);
    }
  }

  return (
    <div className={styles.inngangPaabegyntContainer}>
      <BodyLong>
        {getAppText("inngang.paabegyntsoknad.header.du-har-en-paabegynt")}{" "}
        <FormattedDate date={paabegynt.sistEndretAvbruker ?? paabegynt.opprettet} />.{" "}
        {getAppText("inngang.paabegyntsoknad.header.fortsett-eller-starte-ny")}
      </BodyLong>
      <Link href={paabegynt.soknadUuid} passHref>
        <Button variant="primary" as="a">
          {getAppText("inngang.paabegyntsoknad.fortsett-paabegynt-knapp")}
        </Button>
      </Link>
      <Button variant="secondary" onClick={deleteSoknadAndNavigateToPage} loading={isLoading}>
        {getAppText("inngang.paabegyntsoknad.start-en-ny-knapp")}
      </Button>
      {hasDeleteSoknadError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </div>
  );
}
