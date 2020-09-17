import { Input } from "nav-frontend-skjema";
import { useState } from "react";

export default function Spørsmål({ navn, håndterEndring }) {
  const [validert, settValidert] = useState(false);
  const className = validert ? "lagret" : "";

  async function getOnChange(event) {
    event.persist();
    settValidert(await håndterEndring(event.target.value));
  }

  return (
    <Input label={navn} onChange={getOnChange} inputClassName={className} />
  );
}
