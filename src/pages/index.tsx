import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Heading } from "@navikt/ds-react";
import { useSession } from "../session.utils";

export default function Soknad() {
  const router = useRouter();
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const { session } = useSession({ enforceLogin: false });

  async function startSoknad() {
    setIsCreatingSoknadUUID(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/start`);
    const uuid = response.json();
    router.push(`/${uuid}`);
    setIsCreatingSoknadUUID(false);
  }

  const login = () => {
    if (session === undefined) {
      router.push("/api/auth/signin");
    }
  };

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
