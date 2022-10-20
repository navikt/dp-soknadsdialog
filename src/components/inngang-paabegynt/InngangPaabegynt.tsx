import { Button } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../api.utils";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { IPaabegyntSoknad } from "../../types/quiz.types";

export function InngangPaabegynt(paabegynt: IPaabegyntSoknad) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingToSoknad, setIsNavigatingToSoknad] = useState(false);
  const [hasCreateNewSoknadError, SetHasCreateNewSoknadError] = useState(false);
  const [hasDeleteSoknadError, SetHasDeleteSoknadError] = useState(false);

  function navigateToSoknad() {
    setIsNavigatingToSoknad(true);
    router.push(`/${paabegynt.uuid}`);
  }

  async function deleteAndCreateSoknad() {
    setIsLoading(true);
    const deleteSoknadResponse = await deleteSoknad(paabegynt.uuid);

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

  return (
    <>
      Påbegynt soknad : {paabegynt.startDato}
      <br />
      <Link href="#" passHref>
        <Button variant="primary" onClick={navigateToSoknad} loading={isNavigatingToSoknad} as="a">
          Fortsett
        </Button>
      </Link>
      <Button variant="secondary" onClick={deleteAndCreateSoknad} loading={isLoading}>
        Slett og start på nytt
      </Button>
      {hasDeleteSoknadError && <p>Feil ved sletting av soknad</p>}
      {hasCreateNewSoknadError && <p>Ved ved oppretting av ny soknad</p>}
    </>
  );
}
