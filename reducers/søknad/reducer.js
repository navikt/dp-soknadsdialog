import {
  FAKTUM_LAGRET,
  GÅ_TIL_FORRIGE_SEKSJON,
  GÅ_TIL_OPPSUMMERING,
  LEGG_TIL_NESTE_SEKSJON,
} from "./types";

export const TILSTAND = Object.freeze({
  UTFYLLING: "utfylling",
  OPPSUMMERING: "oppsummering",
});

export const initialState = {
  seksjoner: [],
  tilbakeTeller: 0,
  tilstand: TILSTAND.UTFYLLING,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GÅ_TIL_OPPSUMMERING: {
      return {
        ...state,
        tilstand: TILSTAND.OPPSUMMERING,
      };
    }
    case FAKTUM_LAGRET: {
      const { subsumsjoner, fakta, id } = action;
      const seksjon = { subsumsjoner, fakta, id };

      return {
        ...state,
        seksjoner: state.seksjoner.slice(0, -1).concat(seksjon),
      };
    }
    case LEGG_TIL_NESTE_SEKSJON: {
      const { subsumsjoner, fakta, id } = action;
      const seksjoner = state.seksjoner.concat({ subsumsjoner, fakta, id });
      return {
        ...state,
        tilbakeTeller: seksjoner.length - 1,
        seksjoner,
      };
    }
    case GÅ_TIL_FORRIGE_SEKSJON: {
      const tilbakeTeller = Math.max(0, state.tilbakeTeller - 1);
      if (tilbakeTeller == 0) {
        return state;
      }
      return {
        ...state,
        tilbakeTeller,
        seksjoner: state.seksjoner.concat(state.seksjoner[tilbakeTeller]),
      };
    }
  }
}
