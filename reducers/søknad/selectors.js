export const getAktivSeksjon = (state) =>
  getSeksjoner(state)[getSeksjoner(state).length - 1];
export const getSeksjoner = (state) => state.seksjoner;
