import { ACTIONTYPES } from "./actions";


export enum TILSTAND {
  UTFYLLING = "utfylling",
  OPPSUMMERING = "oppsummering"
}

export interface State {
  seksjoner: any[];
  tilbakeTeller: number;
  tilstand: TILSTAND
}

export const initialState: State = {
  seksjoner: [],
  tilbakeTeller: 0,
  tilstand: TILSTAND.UTFYLLING,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONTYPES.GÅ_TIL_OPPSUMMERING: {
      return {
        ...state,
        tilstand: TILSTAND.OPPSUMMERING,
      };
    }
    case ACTIONTYPES.FAKTUM_LAGRET: {
      const { subsumsjoner, fakta, id } = action;
      const seksjon = { subsumsjoner, fakta, id };

      return {
        ...state,
        seksjoner: state.seksjoner.slice(0, -1).concat(seksjon),
      };
    }
    case ACTIONTYPES.LEGG_TIL_NESTE_SEKSJON: {
      const { subsumsjoner, fakta, id } = action;
      const seksjoner = state.seksjoner.concat({ subsumsjoner, fakta, id });
      return {
        ...state,
        tilbakeTeller: seksjoner.length - 1,
        seksjoner,
      };
    }
    case ACTIONTYPES.GÅ_TIL_FORRIGE_SEKSJON: {
      const tilbakeTeller = Math.max(0, state.tilbakeTeller - 1);
      if (state.tilbakeTeller == 0) {
        //return state;
      }
      return {
        ...state,
        tilbakeTeller,
        seksjoner: state.seksjoner.concat(state.seksjoner[tilbakeTeller]),
      };
    }
  }
}
