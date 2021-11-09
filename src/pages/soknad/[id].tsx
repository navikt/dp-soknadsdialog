import { useRouter } from "next/router";
import useSWR from "swr";
import {Heading} from "@navikt/ds-react";
import React from "react";

const fetcher = (url) => {
  return fetch(url).then((res) => res.json());
};

function HentNesteSeksjon(id) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${id}/neste-seksjon`,
    fetcher
  );

  return {
    seksjon: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function Søknad() {
  const router = useRouter();
  const { id } = router.query;

  const { seksjon, isLoading, isError } = HentNesteSeksjon(id);


  return (
    <div>
      <Heading level="1" size="medium">
        Søknad id: {id}
      </Heading>
      { isLoading ? (<div>laster...</div>) : (<div>{JSON.stringify(seksjon)}</div>)}
      { isError ? (<div>Kunne ikke hente søknad</div>) : (<div></div>)}
    </div>
  );
}
