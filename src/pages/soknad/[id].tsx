import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";
import React from "react";
import { HentNesteSeksjon } from "../../lib/api";

export default function Søknad() {
  const router = useRouter();
  const { id } = router.query;
  const { seksjon, isLoading, isError } = HentNesteSeksjon(id);
  if(isError) return <div>Noe gikk galt, kunne ikke hente søknad</div>
  return (
    <div>
      <Heading level="1" size="medium">
        Søknad id: {id}
      </Heading>
      {isLoading ? <div>laster...</div> : <div>{JSON.stringify(seksjon)}</div>}
    </div>
  );
}
