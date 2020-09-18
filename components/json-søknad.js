import { useEffect, useState } from "react";

async function hentNesteFakta(callback) {
  const fakta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`);
  callback(await fakta.json());
}

export default function JsonSøknad() {
  const [fakta, setFakta] = useState([]);

  useEffect(() => {
    hentNesteFakta(setFakta);
  }, []);

  return (
    <>
      Vi vil stille disse spørsmålene:
      <textarea value={JSON.stringify(fakta)}></textarea>
    </>
  );
}
