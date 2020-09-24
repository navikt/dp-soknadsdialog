import useSWR from "swr";
import PropTypes from "prop-types";
import Subsumsjon from "./subsumsjon";

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

  const root = inlineFaktum(faktaFinner(data.fakta), data.root);
  return (
    <>
      Subsumsjoner:
      <Subsumsjon {...root} />
    </>
  );
}
Subsumsjoner.propTypes = { søknadId: PropTypes.string };

const inlineFaktum = (
  finnFaktum,
  { subsumsjoner = [], fakta = [], ...subsumsjon }
) => ({
  ...subsumsjon,
  fakta: fakta.map(finnFaktum),
  subsumsjoner: subsumsjoner.map((it) => inlineFaktum(finnFaktum, it)),
});

const faktaFinner = (alleFakta) => (faktumId) =>
  alleFakta.find((faktum) => faktum.id === faktumId);
