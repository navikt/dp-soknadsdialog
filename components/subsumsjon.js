export default function Subsumsjon({ subsumsjoner = [], dybde = 0 }) {
  if (!subsumsjoner.length) {
    return null;
  }

  return subsumsjoner.map(
    ({ navn, resultat = false, fakta = [], subsumsjoner }) => (
      <div
        key={navn}
        data-testid="subsumsjon"
        style={{ paddingLeft: dybde * 15 }}
      >
        {navn}

        {!!fakta.length && (
          <ul>
            {fakta.map((faktum) => (
              <li key={faktum.id} data-testid="faktum">
                <b>Navn:</b> {faktum.navn}
                <br />
                <b>Svar:</b> {faktum.svar}
                <br />
                <b>Status:</b>
                {resultat && "✅"}
                {!resultat && "❌"}
              </li>
            ))}
          </ul>
        )}

        <Subsumsjon subsumsjoner={subsumsjoner} dybde={dybde + 1} />
      </div>
    )
  );
}
