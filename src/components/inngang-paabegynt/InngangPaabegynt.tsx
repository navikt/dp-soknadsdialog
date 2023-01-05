import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../api/arbeidssoker-api";
import { ErrorTypesEnum } from "../../types/error.types";
import { IPaabegyntSoknad } from "../../types/quiz.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { FormattedDate } from "../FormattedDate";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import { IDeleteSoknadBody } from "../../pages/api/soknad/delete";
import styles from "./inngangPaabegynt.module.css";

interface IProps {
  paabegynt: IPaabegyntSoknad;
  arbeidssokerStatus: IArbeidssokerStatus;
}
export function InngangPaabegynt({ paabegynt, arbeidssokerStatus }: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const [deleteSoknad, deleteSoknadStatus] = useDeleteRequest<IDeleteSoknadBody>("soknad/delete");
  const [isNagivating, setNavigating] = useState(false);

  useEffect(() => {
    if (deleteSoknadStatus === "success") {
      const destinationPage =
        arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker";
      router.push(destinationPage);
    }
  }, [deleteSoknadStatus]);

  return (
    <div className={styles.inngangPaabegyntContainer}>
      <BodyLong>
        {getAppText("inngang.paabegyntsoknad.header.du-har-en-paabegynt")}{" "}
        <FormattedDate date={paabegynt.sistEndretAvbruker ?? paabegynt.opprettet} />.{" "}
        {getAppText("inngang.paabegyntsoknad.header.fortsett-eller-starte-ny")}
      </BodyLong>

      <Link href={`/soknad/${paabegynt.soknadUuid}?fortsett=true`} passHref>
        <Button variant="primary" as="a" loading={isNagivating} onClick={() => setNavigating(true)}>
          {getAppText("inngang.paabegyntsoknad.fortsett-paabegynt-knapp")}
        </Button>
      </Link>

      <Button
        variant="secondary"
        onClick={() => deleteSoknad({ uuid: paabegynt.soknadUuid })}
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
