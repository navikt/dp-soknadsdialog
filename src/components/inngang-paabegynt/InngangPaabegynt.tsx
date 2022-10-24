import { BodyLong, Button } from "@navikt/ds-react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../api.utils";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ErrorTypesEnum } from "../../types/error.types";
import { IPaabegyntSoknad } from "../../types/quiz.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import styles from "./inngangPaabegynt.module.css";

interface IProps {
  paabegynt: IPaabegyntSoknad;
  arbeidssokerStatus?: IArbeidssokerStatus;
}
export function InngangPaabegynt({ paabegynt, arbeidssokerStatus }: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();

  const [isLoading, setIsLoading] = useState(false);
  const [hasCreateNewSoknadError, SetHasCreateNewSoknadError] = useState(false);
  const [hasDeleteSoknadError, SetHasDeleteSoknadError] = useState(false);

  async function deleteAndCreateSoknad() {
    setIsLoading(true);
    const deleteSoknadResponse = await deleteSoknad(paabegynt.soknadUuid);

    if (deleteSoknadResponse.ok) {
      createNewSoknad();
    } else {
      setIsLoading(false);
      SetHasDeleteSoknadError(true);
      throw new Error(deleteSoknadResponse.statusText);
    }
  }

  async function createNewSoknad() {
    try {
      setIsLoading(true);
      const uuidResponse = await fetch(api("soknad/get-uuid"));

      if (uuidResponse.ok) {
        const uuid = await uuidResponse.text();
        router.push(`/${uuid}`);
      } else {
        setIsLoading(false);
        throw new Error(uuidResponse.statusText);
      }
    } catch (error) {
      // TODO Sentry log
      // eslint-disable-next-line no-console
      console.error(error);
      setIsLoading(false);
      SetHasCreateNewSoknadError(true);
    }
  }

  const formattedSoknadDate = format(parseISO(paabegynt.opprettet), "dd. MMMM yyyy");

  return (
    <div className={styles.inngangPaabegyntContainer}>
      <BodyLong>
        {getAppText("inngang.paabegyntsoknad.header.du-har-en-paabegynt")} {formattedSoknadDate}.{" "}
        {getAppText("inngang.paabegyntsoknad.header.fortsett-eller-starte-ny")}
      </BodyLong>
      <Link href={paabegynt.soknadUuid} passHref>
        <Button variant="primary" as="a">
          {getAppText("inngang.paabegyntsoknad.fortsett-paabegynt-knapp")}
        </Button>
      </Link>
      {arbeidssokerStatus === "REGISTERED" && (
        <Button variant="secondary" onClick={deleteAndCreateSoknad} loading={isLoading}>
          {getAppText("inngang.paabegyntsoknad.start-en-ny-knapp")}
        </Button>
      )}
      {arbeidssokerStatus !== "REGISTERED" && (
        <Link href="arbeidssoker" passHref>
          <Button variant="secondary" as="a">
            {getAppText("inngang.paabegyntsoknad.start-en-ny-knapp")}
          </Button>
        </Link>
      )}
      {(hasDeleteSoknadError || hasCreateNewSoknadError) && (
        <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />
      )}
    </div>
  );
}
