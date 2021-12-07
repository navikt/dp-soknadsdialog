import { Quiz } from "../models/quiz";
import { RadioButtonInput } from "./inputs/RadioButtonInput";
import { saveFaktum } from "../services/api";
import { TextField } from "@navikt/ds-react";

export function Seksjon({ søknadsUuid, seksjon }: { søknadsUuid: string; seksjon: Quiz.Seksjon }) {
  return (
    <>
      Seksjonsnavn: {seksjon.seksjon_navn}
      {seksjon &&
        seksjon.fakta
          .filter((f) => f.type === Quiz.DataType.BOOLEAN)
          .map(({ id, navn, type }) => (
            <RadioButtonInput
              key={id}
              legend={navn}
              options={[
                { text: "Ja", value: "true" },
                { text: "Nei", value: "false" },
              ]}
              onSelection={(verdi) => saveFaktum(søknadsUuid, id, type, verdi)}
            />
          ))}
      {seksjon &&
        seksjon.fakta
          .filter((f) => f.type !== Quiz.DataType.BOOLEAN)
          .map(({ id, navn }) => (
            <TextField
              key={id}
              label={`${navn} (ikke støttet :-( )`}
              type={"text"}
              data-testid={`input-${id}`}
            />
          ))}
    </>
  );
}
