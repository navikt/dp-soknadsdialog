import { useEffect, useState } from "react";
import Spørsmål from "./spørsmål";

async function hentNesteFakta(callback) {
  const fakta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`);
  callback(await fakta.json());
}

async function lagreFakta(data) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faktum/123`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return true;
}

export default function Søknad() {
  const [fakta, setFakta] = useState([]);

  useEffect(() => {
    hentNesteFakta(setFakta);
  }, []);

  return (
    <>
      Vi vil stille disse spørsmålene:
      {fakta.map((faktum) => (
        <Spørsmål key={faktum.id} {...faktum} håndterEndring={lagreFakta} />
      ))}
    </>
  );
}
