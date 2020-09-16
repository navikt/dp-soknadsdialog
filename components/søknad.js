import fetch from "node-fetch";
import { useState, useEffect } from "react";
import Spørsmål from "./spørsmål";

async function hentNesteFakta(callback) {
  //const fakta = fetch(window.location.href + "/../api/neste-fakta") //"http://dp-quiz/neste-fakta")
  const fakta = await fetch("http://dp-quiz/neste-fakta")
  callback(await fakta.json());
}

export default function Søknad() {
  const [fakta, setFakta] = useState([]);

  useEffect(() => {
    function handleNyeFakta(fakta) {
      setFakta(fakta);
    }
    hentNesteFakta(handleNyeFakta);
  }, []);

  return (
    <div>
      Vi vil stille disse spørsmålene:
      {fakta.map((faktum) => (
        <Spørsmål key={faktum.navn} navn={faktum.navn} />
      ))}
    </div>
  );
}
