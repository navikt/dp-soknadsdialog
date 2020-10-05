export default function Subsumsjon({ subsumsjoner = [], dybde = 0 }) {
  if (!subsumsjoner.length) {
    return null;
  }

  return subsumsjoner.map(
    ({ navn, resultat = false, fakta = [], subsumsjoner, gyldig, ugyldig }) => (
      <div
        key={navn}
        data-testid="subsumsjon"
        style={{ paddingLeft: dybde * 15 }}
      >
        {resultat && "✅"}
        {!resultat && "❌"}
        &nbsp;&nbsp;
        {navn}
        {!!fakta.length && (
          <ul>
            {fakta.map((faktum) => (
              <li key={faktum.id} data-testid="faktum">
                {resultat && "✅"}
                {!resultat && "❌"}
                &nbsp;&nbsp;
                {faktum.navn}
                <br />
                <b>Svar:</b> {faktum.svar}
                {faktum.svar === true && "✅"}
                {faktum.svar === false && "❌"}
              </li>
            ))}
          </ul>
        )}
        <Subsumsjon subsumsjoner={subsumsjoner} dybde={dybde + 1} />
        <Subsumsjon subsumsjoner={gyldig} dybde={dybde + 2} />
        <Subsumsjon subsumsjoner={ugyldig} dybde={dybde + 2} />
      </div>
    )
  );
}
