import React, { useState } from "react";
import { ISoknad } from "./api/soknad";
import { useDispatch } from "react-redux";
import { setSeksjoner } from "../store/seksjoner.slice";
import { useRouter } from "next/router";
import { Button, Heading } from "@navikt/ds-react";
import api from "../api.utils";
import { useSession } from "../session.utils";

export default function Soknad() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const { session } = useSession({ enforceLogin: false });
  const startSoknad = async () => {
    setIsCreatingSoknadUUID(true);
    await fetch(api("soknad"))
      .then((response: Response) => response.json())
      .then((data: ISoknad) => {
        dispatch(setSeksjoner(data.sections));
        router.push(`/${data.soknadId}/seksjon/0`);
      });
    setIsCreatingSoknadUUID(false);
  };

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
