import React, { useState } from "react";
import { Button, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useSession } from "../session.utils";

export function StartSoknad() {
  const router = useRouter();
  const { session } = useSession({ enforceLogin: false });
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);

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
    <div>
      <Heading spacing size="xlarge" level="1">
        Søknad om dagpenger
      </Heading>

      {session === undefined && (
        <Button variant="primary" size="medium" onClick={login}>
          logg inn først!
        </Button>
      )}
      <Button variant="primary" size="medium" onClick={startSoknad} loading={isCreatingSoknadUUID}>
        Start søknad
      </Button>
    </div>
  );
}
