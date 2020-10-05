import useSWR from "swr";
import PropTypes from "prop-types";
import Subsumsjon from "./subsumsjon";
import { memoize } from "lodash";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Subsumsjoner({ søknadId }) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/subsumsjoner`,
    fetcher
  );

  if (error) {
    return <div>error!</div>;
  }
  if (!data) {
    return <div>Loading!</div>;
  }

  const faktaFinner = memoize((faktumId) =>
    data.fakta.find((faktum) => faktum.id === faktumId)
  );

  const root = data.root;
  return (
    <>
      Subsumsjoner:
      <Subsumsjon {...root} faktaFinner={faktaFinner} />
    </>
  );
}
Subsumsjoner.propTypes = { søknadId: PropTypes.string };
