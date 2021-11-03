import useSWR, { Fetcher } from "swr";
import PropTypes from "prop-types";
import Subsumsjon from "./subsumsjon";
import { memoize } from "lodash";
import { Quiz } from "../models/quiz";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface Response {
  fakta: Quiz.Faktum[];
  subsumsjoner: Quiz.Subsumsjon[]

}

export default function Subsumsjoner({ søknadId }) {
  const { data, error } = useSWR<Response, any>(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/subsumsjoner`,
    fetcher
  );

  if (error) {
    return <div>error!</div>;
  }
  if (!data) {
    return <div>Loading!</div>;
  }

  const finnFakta = (faktumId: string) => data.fakta.find((faktum: Quiz.Faktum) => faktum.id === faktumId);
  const faktaFinner = memoize(finnFakta);

  const subsumsjoner = data.subsumsjoner;

  return (
    <>
      <br/>
      Subsumsjoner:
      {subsumsjoner.map((subsumsjon) => (
        <Subsumsjon key={subsumsjon.navn} subsumsjon={subsumsjon} faktaFinner={faktaFinner} />
        ))}

    </>
  );
}
Subsumsjoner.propTypes = { søknadId: PropTypes.string };
