export default function Subsumsjon({ subsumsjoner = [], dybde = 0 }) {
  if (!subsumsjoner.length) {
    return null;
  }

  return subsumsjoner.map(({ navn, subsumsjoner }) => (
    <div
      key={navn}
      data-testid="subsumsjon"
      style={{ paddingLeft: dybde * 15 }}
    >
      {navn}

      <Subsumsjon subsumsjoner={subsumsjoner} dybde={dybde + 1} />
    </div>
  ));
}
