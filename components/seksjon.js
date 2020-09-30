import Spørsmål from "./spørsmål";

export default function Seksjon({
  fakta = [],
  faktumlagrer,
  hentNesteSeksjon,
}) {
  return (
    <>
      Vi vil stille disse spørsmålene:
      {fakta.map((faktum) => (
        <Spørsmål
          key={faktum.id}
          {...{ ...faktum, type: faktum.clazz }}
          håndterEndring={faktumlagrer}
        />
      ))}
      <button
        disabled={!alleFaktaLagret(fakta)}
        data-testid="neste-knapp"
        onClick={hentNesteSeksjon}
      >
        Neste seksjon
      </button>
    </>
  );
}

const alleFaktaLagret = (fakta) => fakta.every((faktum) => faktum.svar);
