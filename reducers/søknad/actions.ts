export const ACTIONTYPES = {
  LEGG_TIL_NESTE_SEKSJON: "kulTekst",
  GÅ_TIL_FORRIGE_SEKSJON: "forrigeSeksjon",
  FAKTUM_LAGRET: "faktumLagret",
  GÅ_TIL_OPPSUMMERING: "gåTilOppsummering",
};


export const leggTilNesteSeksjon = ({ id, fakta = [], subsumsjoner = {} }) => ({
  type: ACTIONTYPES.LEGG_TIL_NESTE_SEKSJON,
  fakta,
  subsumsjoner,
  id,
});

export const gåTilForrigeSeksjon = () => ({
  type: ACTIONTYPES.GÅ_TIL_FORRIGE_SEKSJON,
});

export const faktumLagret = (seksjon) => ({
  type: ACTIONTYPES.FAKTUM_LAGRET,
  ...leggTilNesteSeksjon(seksjon),
});

export const gåTilOppsummering = () => ({
  type: ACTIONTYPES.GÅ_TIL_OPPSUMMERING,
});
