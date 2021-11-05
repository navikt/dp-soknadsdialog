import { Quiz } from "../models/quiz";
import { LawFilled, Information } from "@navikt/ds-icons";

interface SubsumsjonProps {
  subsumsjon: Quiz.Subsumsjon;
  faktaFinner: (faktumId) => Quiz.Faktum;
  dybde?: number;
}

export default function Subsumsjon({
  subsumsjon,
  dybde = 0,
  faktaFinner,
}: SubsumsjonProps) {

  const renderLokaltResultat = () => {
    if (subsumsjon.lokalt_resultat == null) return "❓";
    return subsumsjon.lokalt_resultat ? "✅" : "❌";
  }

  const FaktumKomponent = (props: { faktum: Quiz.Faktum }) => {
    const { faktum } = props;
    return (
      <li key={faktum.id} data-testid="faktum">
        <Information />
        {faktum.navn}
        {faktum.svar !== undefined ? "✅" : "❓"}
        <br />
        <b>Svar:</b> {faktum.svar}
        {faktum.svar === true && "✅"}
        {faktum.svar === false && "❌"}
      </li>
    )
  }

  const renderFakta = () => {
    if (!subsumsjon.fakta || !subsumsjon.fakta.length) return <></>;
    return (
      <ul>
        {subsumsjon.fakta.map(faktaFinner).map((faktum) => (
          <FaktumKomponent key={faktum.id} faktum={faktum}/>
        ))}
      </ul>
    );
  }

  const renderSubsumsjoner = () => {
    if (!subsumsjon.subsumsjoner || !subsumsjon.subsumsjoner.length) return <></>;
    return (
      <ul>
        {subsumsjon.subsumsjoner.map((subsumsjon) => (
          <Subsumsjon
            key={subsumsjon.navn}
            subsumsjon={subsumsjon}
            dybde={dybde + 1}
            faktaFinner={faktaFinner}
          />
        ))}
      </ul>
    )
  }

  return (
    <div data-testid="subsumsjon" style={{ paddingLeft: dybde * 15 }}>
      <LawFilled />
      {subsumsjon.navn}
      {renderLokaltResultat()}
      {renderFakta()}
      {renderSubsumsjoner()}
    </div>
  );
}
