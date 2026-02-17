import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSanity } from "../../context/sanity-context";
import { useDeleteRequest } from "../../hooks/request/useDeleteRequest";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";
import { IDeleteOrkestratorSoknadBody } from "../../pages/api/orkestrator/delete";
import { IDeleteSoknadBody } from "../../pages/api/soknad/delete";
import { ErrorTypesEnum } from "../../types/error.types";
import { IPaabegyntSoknad } from "../../types/quiz.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { FormattedDate } from "../FormattedDate";

import styles from "./inngangPaabegynt.module.css";

interface IProps {
  paabegynt: IPaabegyntSoknad;
  arbeidssokerStatus: IArbeidssokerStatus;
  isOrkestratorSoknad?: boolean;
  brukerdialogUrl: string;
}

export function InngangPaabegynt({
  paabegynt,
  arbeidssokerStatus,
  isOrkestratorSoknad,
  brukerdialogUrl,
}: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();

  const [deleteQuizSoknad, deleteQuizSoknadStatus] =
    useDeleteRequest<IDeleteSoknadBody>("soknad/delete");
  const [deleteOrkestratorSoknad, deleteOrkestratorSoknadStatus] =
    useDeleteRequest<IDeleteOrkestratorSoknadBody>("orkestrator/delete");

  const deleteSoknadStatus = isOrkestratorSoknad
    ? deleteOrkestratorSoknadStatus
    : deleteQuizSoknadStatus;

  useEffect(() => {
    if (deleteSoknadStatus === "success") {
      const destinationPage =
        arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker";
      router.push(destinationPage);
    }
  }, [deleteSoknadStatus, arbeidssokerStatus, router]);

  function handleDeleteSoknad() {
    if (isOrkestratorSoknad) {
      deleteOrkestratorSoknad({ uuid: paabegynt.soknadUuid });
    } else {
      deleteQuizSoknad({ uuid: paabegynt.soknadUuid });
    }
  }

  return (
    <div className={styles.inngangPaabegyntContainer}>
      <BodyLong>
        {getAppText("inngang.paabegyntsoknad.header.du-har-en-paabegynt")}{" "}
        <FormattedDate date={paabegynt.sistEndretAvbruker ?? paabegynt.opprettet} />.{" "}
        {getAppText("inngang.paabegyntsoknad.header.fortsett-eller-starte-ny")}
      </BodyLong>

      <Link
        href={
          isOrkestratorSoknad
            ? `${brukerdialogUrl}/${paabegynt.soknadUuid}/personalia`
            : `/soknad/${paabegynt.soknadUuid}?fortsett=true`
        }
        passHref
        legacyBehavior
      >
        <Button variant="primary" as="a">
          {getAppText("inngang.paabegyntsoknad.fortsett-paabegynt-knapp")}
        </Button>
      </Link>

      <Button
        variant="secondary"
        onClick={handleDeleteSoknad}
        loading={deleteSoknadStatus === "pending"}
      >
        {getAppText("inngang.paabegyntsoknad.start-en-ny-knapp")}
      </Button>

      {deleteSoknadStatus === "error" && (
        <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />
      )}
    </div>
  );
}
