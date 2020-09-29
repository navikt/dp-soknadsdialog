import { LEGG_TIL_NESTE_SEKSJON } from "./types";

export const leggTilNesteSeksjon = ({ fakta = [], subsumsjoner = {} }) => ({
  type: LEGG_TIL_NESTE_SEKSJON,
  fakta,
  subsumsjoner,
});

export const gåTilForrigeSeksjon = () => ({
  type: GÅ_TIL_FORRIGE_SEKSJON,
});
