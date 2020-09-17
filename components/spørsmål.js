import { Input } from "nav-frontend-skjema";
import { useState } from "react";

export default function Spørsmål({ navn, håndterEndring }) {
  const [validert, settValidert] = useState(false);
  const className = validert ? "lagret" : "";
  return (
    <Input
      label={navn}
      onChange={async (event) => {
        settValidert(await håndterEndring(event.target.value));
      }}
      inputClassName={className}
    />
  );
}
