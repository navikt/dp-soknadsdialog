export const getAktivSeksjon = (state) =>
  getSeksjoner(state)[getSeksjoner(state).length];
export const getSeksjoner = (state) => state.seksjoner;
