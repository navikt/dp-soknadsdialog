import { useEffect, useState } from "react";
import Spørsmål from "./spørsmål";

async function hentNesteFakta(søknadId, callback) {
  const nesteSeksjon = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/neste-seksjon`
  );
  const json = await nesteSeksjon.json();
  callback(json.fakta);
}

async function lagreFakta(søknadId, faktumId, type, verdi) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/faktum/${faktumId}`,
    {
      method: "PUT",
      body: JSON.stringify({ type, verdi }),
    }
  );
  return true;
}

export default function Søknad({ id }) {
  const [fakta, setFakta] = useState([]);
  const faktalagrer = (type, verdi) => lagreFakta(id, type, verdi);

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
    </>
  );
}
