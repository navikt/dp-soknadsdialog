import useSWR from "swr";
import Subsumsjon from "./subsumsjon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Subsumsjoner() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/subsumsjoner`,
    fetcher
  );

  if (error) {
    return <div>error!</div>;
  }
  if (!data) {
    return <div>Loading!</div>;
  }
  return (
    <>
      Subsumsjoner:
      <Subsumsjon {...data.root} />
    </>
  );
}
