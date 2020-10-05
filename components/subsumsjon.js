export default function Subsumsjon({
  navn,
  subsumsjoner = [],
  resultat = false,
  fakta = [],
  gyldig,
  dybde = 0,
}) {
  return (
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
              {faktum.svar !== undefined ? "✅" : "❓"}
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
      {subsumsjoner.map((subsumsjon) => (
        <Subsumsjon {...subsumsjon} dybde={dybde + 1} gyldig={gyldig} />
      ))}
      {gyldig && <Subsumsjon {...gyldig}></Subsumsjon>}
    </div>
  );
}
