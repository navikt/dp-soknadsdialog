import React, { useState } from "react";
import { Button, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useSession } from "../session.utils";
import { useSanity } from "../context/sanity-context";

export function StartSoknad() {
  const router = useRouter();
  const { session } = useSession({ enforceLogin: false });
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const { getAppTekst } = useSanity();

  async function startSoknad() {
    setIsCreatingSoknadUUID(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/get-uuid`);
    const uuid = await response.text();

    router.push(`/${uuid}`);
    setIsCreatingSoknadUUID(false);
  }

  function login() {
    if (session === undefined) {
      router.push("/api/auth/signin");
    }
  }

  return (
    <main>
      <Heading spacing size="xlarge" level="1">
        {getAppTekst("start-soknad.tittel")}
      </Heading>

      {session === undefined && (
        <Button variant="primary" size="medium" onClick={login}>
          logg inn først!
        </Button>
      )}
      <Button variant="primary" size="medium" onClick={startSoknad} loading={isCreatingSoknadUUID}>
        {getAppTekst("start-soknad.start-knapp")}
      </Button>
    </main>
  );
}
