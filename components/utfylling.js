import Seksjon from "./seksjon";
import { gåTilForrigeSeksjon } from "../reducers/søknad/actions";

export default function Utfylling({
  seksjon,
  faktumlagrer,
  hentNesteSeksjon,
  gåTilForrigeSeksjon,
}) {
  if (typeof seksjon === "undefined") return null;

  return (
    <>
      <Seksjon
        fakta={seksjon.fakta}
        faktumlagrer={faktumlagrer}
        hentNesteSeksjon={hentNesteSeksjon}
      />
      <button
        disabled={!alleFaktaLagret(seksjon.fakta)}
        data-testid="neste-knapp"
        onClick={hentNesteSeksjon}
      >
        Neste seksjon
      </button>
      <button
        disabled={false}
        data-testid="tilbake-knapp"
        onClick={gåTilForrigeSeksjon}
      >
        Tilbake
      </button>
    </>
  );
}
const alleFaktaLagret = (fakta) =>
  fakta.every((faktum) => typeof faktum.svar !== "undefined");
