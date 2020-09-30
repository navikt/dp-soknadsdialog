import Seksjon from "./seksjon";

export default function Utfylling({ seksjon, faktumlagrer, hentNesteSeksjon }) {
  if (typeof seksjon === "undefined") return null;

  return (
    <Seksjon
      fakta={seksjon.fakta}
      faktumlagrer={faktumlagrer}
      hentNesteSeksjon={hentNesteSeksjon}
    />
  );
}
