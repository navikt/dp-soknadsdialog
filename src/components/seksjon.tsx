import { Quiz } from "../models/quiz";
import { RadioButtonInput } from "./inputs/radio-input.component";

function Seksjon({ seksjon }: { seksjon: Quiz.Seksjon }) {
  return (
    <>
      Seksjonsnavn: {seksjon.seksjon_navn}
      {seksjon.fakta.map((faktum) => (
        <RadioButtonInput
          key={faktum.id}
          legend={faktum.navn}
          options={[
            { text: "Ja", value: "true" },
            { text: "Nei", value: "false" },
          ]}
          onSelection={(event) => console.log(`Endret ${event}`)}
        />
      ))}
    </>
  );
}

export default Seksjon;
