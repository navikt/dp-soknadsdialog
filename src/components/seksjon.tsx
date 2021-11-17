import { Quiz } from "../models/quiz";
import { RadioButtonInput } from "./inputs/radio-input.component";
import { lagreFaktum } from "../lib/api";

function Seksjon({ id, seksjon }: { id: any; seksjon: Quiz.Seksjon }) {
  return (
    <>
      Seksjonsnavn: {seksjon.seksjon_navn}
      {seksjon &&
        seksjon.fakta.map((faktum) => (
          <RadioButtonInput
            key={faktum.id}
            legend={faktum.navn}
            options={[
              { text: "Ja", value: "true" },
              { text: "Nei", value: "false" },
            ]}
            onSelection={(verdi) =>
              lagreFaktum(id, faktum.id, faktum.type, verdi)
            }
          />
        ))}
    </>
  );
}

export default Seksjon;
