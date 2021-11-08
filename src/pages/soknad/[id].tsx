import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (...args) => {
  return fetch(...args).then((res) => res.json());
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

  if (isLoading) return <div>laster...</div>;
  if (isError) return <div>Kunne ikke hente søknad</div>;

  return (
    <div>
      <h1>Søknad: {id}</h1>
      {JSON.stringify(seksjon)}
    </div>
  );
}
