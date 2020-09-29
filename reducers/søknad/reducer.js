import {
  FAKTUM_LAGRET,
  GÅ_TIL_FORRIGE_SEKSJON,
  LEGG_TIL_NESTE_SEKSJON,
} from "./types";

const initialValue = { seksjoner: [], tilbakeTeller: 0 };

export default function reducer(state = initialValue, action) {
  switch (action.type) {
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
      return {
        ...state,
        tilbakeTeller,
        seksjoner: state.seksjoner.concat(state.seksjoner[tilbakeTeller]),
      };
    }
  }
}
