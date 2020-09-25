import { useEffect, useState } from "react";
import Spørsmål from "./spørsmål";

async function hentNesteFakta(søknadId, callback) {
  const nesteSeksjon = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/neste-seksjon`
  );
  const json = await nesteSeksjon.json();
  callback(json.fakta);
}

export default function Søknad({ id }) {
  const [fakta, setFakta] = useState([]);

  const lagreFakta = async (søknadId, faktumId, type, verdi) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/faktum/${faktumId}`,
      {
        method: "PUT",
        body: JSON.stringify({ type, verdi }),
      }
    );

    setFakta(
      fakta.map((faktum) => {
        if (faktum.id !== faktumId) return faktum;
        return { ...faktum, lagret: true };
      })
    );

    return true;
  };

  const faktalagrer = (...args) => lagreFakta(id, ...args);

  const alleFaktaErLagret = () =>
    fakta.length !== 0 && fakta.every((faktum) => faktum.lagret);

  useEffect(() => {
    hentNesteFakta(id, setFakta);
  }, []);

  return (
    <>
      Vi vil stille disse spørsmålene:
      {fakta.map((faktum) => (
        <Spørsmål
          key={faktum.id}
          {...{ ...faktum, type: faktum.clazz }}
          håndterEndring={faktalagrer}
        />
      ))}
      <button disabled={!alleFaktaErLagret()} data-testid="neste-knapp">
        Neste seksjon
      </button>
    </>
  );
}
