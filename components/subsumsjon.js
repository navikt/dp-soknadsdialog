export default function Subsumsjon({
  navn,
  subsumsjoner = [],
  lokalt_resultat = null,
  fakta = [],
  gyldig,
  ugyldig,
  dybde = 0,
  faktaFinner,
}) {
  return (
    <div data-testid="subsumsjon" style={{ paddingLeft: dybde * 15 }}>
      {lokalt_resultat === true && "✅"}
      {lokalt_resultat === false && "❌"}
      {lokalt_resultat == null && "❓"}
      &nbsp;&nbsp;
      {navn}
      {!!fakta.length && (
        <ul>
          {fakta.map(faktaFinner).map((faktum) => (
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
        <Subsumsjon
          key={subsumsjon.navn}
          {...subsumsjon}
          dybde={dybde + 1}
          faktaFinner={faktaFinner}
        />
      ))}
      {lokalt_resultat !== false && gyldig && (
        <Subsumsjon {...gyldig} faktaFinner={faktaFinner}></Subsumsjon>
      )}
      {lokalt_resultat === false && ugyldig && (
        <Subsumsjon {...ugyldig} faktaFinner={faktaFinner}></Subsumsjon>
      )}
    </div>
  );
}
