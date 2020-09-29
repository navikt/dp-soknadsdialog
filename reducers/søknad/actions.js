import { GÅ_TIL_FORRIGE_SEKSJON, LEGG_TIL_NESTE_SEKSJON } from "./types";

export const leggTilNesteSeksjon = ({ id, fakta = [], subsumsjoner = {} }) => ({
  type: LEGG_TIL_NESTE_SEKSJON,
  fakta,
  subsumsjoner,
  id,
});

export const gåTilForrigeSeksjon = () => ({
  type: GÅ_TIL_FORRIGE_SEKSJON,
});
