import { GÅ_TIL_FORRIGE_SEKSJON, LEGG_TIL_NESTE_SEKSJON } from "./types";

const initialValue = { seksjoner: [], tilbakeTeller: 0 };

export default function reducer(state = initialValue, action) {
  switch (action.type) {
    case LEGG_TIL_NESTE_SEKSJON: {
      const { subsumsjoner, fakta } = action;
      return {
        ...state,
        tilbakeTeller: state.seksjoner.length,
        seksjoner: state.seksjoner.concat({ subsumsjoner, fakta }),
      };
    }
    case GÅ_TIL_FORRIGE_SEKSJON: {
      const tilbakeTeller = Math.max(0, state.tilbakeTeller--);
      return {
        ...state,
        tilbakeTeller,
        seksjoner: state.seksjoner.concat(state.seksjoner[tilbakeTeller]),
      };
    }
  }
}
