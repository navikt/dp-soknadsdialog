import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";
import React from "react";
import { getNextSeksjon } from "../../services/api";
import { Seksjon } from "../../components/Seksjon";

export default function Søknad() {
  const router = useRouter();
  const { id } = router.query;
  const { seksjon, isLoading, isError } = getNextSeksjon(id);
  if (isError) return <div>Noe gikk galt, kunne ikke hente søknad</div>;
  return (
    <div>
      <Heading level="1" size="medium">
        Søknad id: {id}
      </Heading>
      {isLoading ? (
        <div>laster...</div>
      ) : (
        <Seksjon søknadsUuid={id} seksjon={seksjon} />
      )}
    </div>
  );
}
