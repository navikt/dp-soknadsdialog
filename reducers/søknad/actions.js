import {
  FAKTUM_LAGRET,
  GÅ_TIL_FORRIGE_SEKSJON,
  GÅ_TIL_OPPSUMMERING,
  LEGG_TIL_NESTE_SEKSJON,
} from "./types";

export const leggTilNesteSeksjon = ({ id, fakta = [], subsumsjoner = {} }) => ({
  type: LEGG_TIL_NESTE_SEKSJON,
  fakta,
  subsumsjoner,
  id,
});

export const gåTilForrigeSeksjon = () => ({
  type: GÅ_TIL_FORRIGE_SEKSJON,
});

export const faktumLagret = (seksjon) => ({
  type: FAKTUM_LAGRET,
  ...leggTilNesteSeksjon(seksjon),
});

export const gåTilOppsummering = () => ({
  type: GÅ_TIL_OPPSUMMERING,
});
