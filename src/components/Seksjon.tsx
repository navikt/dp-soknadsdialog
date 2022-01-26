import { Quiz } from "../models/quiz";
import { RadioButtonInput } from "./inputs/RadioButtonInput";
import { saveFaktum } from "../services/api";
import { TextField } from "@navikt/ds-react";

export function Seksjon({ søknadsUuid, fakta }: { søknadsUuid: string; fakta: Quiz.Fakta }) {
  return (
    <>
      {fakta &&
        fakta.fakta
          .filter((f) => f.type === Quiz.DataType.BOOLEAN)
          .map(({ id, beskrivendeId, type }) => (
            <RadioButtonInput
              key={id}
              legend={beskrivendeId}
              options={[
                { text: "Ja", value: "true" },
                { text: "Nei", value: "false" },
              ]}
              onSelection={(verdi) => saveFaktum(søknadsUuid, id, type, verdi)}
            />
          ))}
      {fakta &&
        fakta.fakta
          .filter((f) => f.type !== Quiz.DataType.BOOLEAN)
          .map(({ id, beskrivendeId }) => (
            <TextField
              key={id}
              label={`${beskrivendeId} (ikke støttet :-( )`}
              type={"text"}
              data-testid={`input-${id}`}
            />
          ))}
    </>
  );
}
