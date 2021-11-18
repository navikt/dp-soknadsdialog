import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";
import React from "react";
import { HentNesteSeksjon } from "../../services/api";
import Seksjon from "../../components/seksjon";

export default function Søknad() {
  const router = useRouter();
  const { id } = router.query;
  const { seksjon, isLoading, isError } = HentNesteSeksjon(id);
  if (isError) return <div>Noe gikk galt, kunne ikke hente søknad</div>;
  return (
    <div>
      <Heading level="1" size="medium">
        Søknad id: {id}
      </Heading>
      {isLoading ? <div>laster...</div> : <Seksjon seksjon={seksjon} />}
    </div>
  );
}
