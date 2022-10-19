import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../api.utils";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { IPaabegyntSoknad } from "../../types/quiz.types";

export function InngangPaabegynt(paabegynt: IPaabegyntSoknad) {
  const router = useRouter();

  const [isNavigatingToSoknad, setIsNavigatingToSoknad] = useState(false);
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  // const [hasCreateNewSoknadError, SetHasCreateNewSoknadError] = useState(false);

  function navigateToSoknad() {
    setIsNavigatingToSoknad(true);
    router.push(`/${paabegynt.uuid}`);
  }

  async function deleteAndCreateNewSoknad() {
    const deleteSoknadResponse = await deleteSoknad(paabegynt.uuid);
    if (deleteSoknadResponse.ok) {
      createNewSoknad();
    } else {
      throw new Error(deleteSoknadResponse.statusText);
    }
  }

  async function createNewSoknad() {
    try {
      setIsCreatingSoknadUUID(true);
      const uuidResponse = await fetch(api("soknad/get-uuid"));

      if (uuidResponse.ok) {
        const uuid = await uuidResponse.text();
        router.push(`/${uuid}`);
      } else {
        throw new Error(uuidResponse.statusText);
      }
    } catch (error) {
      // TODO Sentry log
      // eslint-disable-next-line no-console
      console.error(error);
      // SetHasCreateNewSoknadError(true);
    }
  }

  return (
    <>
      Påbegynt soknad : {paabegynt.startDato}
      <br />
      <Button variant="primary" onClick={navigateToSoknad} loading={isNavigatingToSoknad}>
        Fortsett
      </Button>
      <Button variant="secondary" onClick={deleteAndCreateNewSoknad} loading={isCreatingSoknadUUID}>
        Slett og start på nytt
      </Button>
    </>
  );
}
1;
