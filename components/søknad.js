import { useEffect, useState } from "react";
import Spørsmål from "./spørsmål";

async function hentNesteFakta(søknadId, callback) {
  const nesteSeksjon = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/søknad/${søknadId}/neste-seksjon`
  );
  const json = await nesteSeksjon.json();
  callback(json.fakta);
}

async function lagreFakta(søknadId, data) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/søknad/${søknadId}/faktum/123`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
  return true;
}

export default function Søknad({ id }) {
  const [fakta, setFakta] = useState([]);
  const faktalagrer = (data) => lagreFakta(id, data);

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
