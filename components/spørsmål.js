import InputSpørsmål from "./input-spørsmål";
import { useState } from "react";
import DatoSpørsmål from "./dato-spørsmål";

const mapping = {
  LocalDate: DatoSpørsmål,
};
export default function Spørsmål({ type, håndterEndring, ...rest }) {
  const [validert, settValidert] = useState(false);

  async function getOnChange(value) {
    settValidert(await håndterEndring(value));
  }

  const className = validert ? "lagret" : "";

  const Komponent = mapping[type] || InputSpørsmål;
  return (
    <>
      <div className={className} data-testid={`spørsmål-${rest.navn}`}>
        <Komponent type={type} {...rest} handleChange={getOnChange} />
      </div>
      <style jsx>{`
        div {
          background-color: blue;
        }
        .lagret {
          background-color: pink;
        }
      `}</style>
    </>
  );
}
