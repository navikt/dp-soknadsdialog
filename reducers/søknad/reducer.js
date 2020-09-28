import { SUBSUMSJONER_HENTET } from "./actions";

const initialValue = { fakta: [], subsumsjoner: {} };

export default function reducer(state = initialValue, action) {
  switch (action.type) {
    case SUBSUMSJONER_HENTET: {
      const { subsumsjoner, fakta } = action;
      return { ...state, subsumsjoner, fakta };
    }
  }
}
