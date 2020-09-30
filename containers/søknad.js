import Utfylling from "../components/utfylling";
import reducer, { initialState } from "../reducers/søknad";
import {
  faktumLagret,
  gåTilOppsummering,
  leggTilNesteSeksjon,
} from "../reducers/søknad/actions";
import {
  erUtfyllingTilstand,
  getAktivSeksjon,
  getTilstand,
} from "../reducers/søknad/selectors";
import React, { useEffect, useReducer } from "react";
import { TILSTAND } from "../reducers/søknad/reducer";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Søknad({ id }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hentNesteSeksjon = async (søknadId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/neste-seksjon`
    );

    if (response.status === 205) {
      return dispatch(gåTilOppsummering());
    }

    const nesteSeksjon = await response.json();

    dispatch(leggTilNesteSeksjon(nesteSeksjon));
  };

  const lagreFakta = async (søknadId, faktumId, type, verdi) => {
    const seksjon = await fetcher(
      `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/faktum/${faktumId}`,
      {
        method: "PUT",
        body: JSON.stringify({ type, verdi }),
      }
    );

    dispatch(faktumLagret(seksjon));
    return true;
  };

  useEffect(() => {
    hentNesteSeksjon(id);
  }, [id]);

  const faktumlagrer = (...args) => lagreFakta(id, ...args);
  const seksjon = getAktivSeksjon(state);
  const søkemodus = erUtfyllingTilstand(state);
  const Oppsummering = () => (
    <div data-testid="oppsummering">DU ER FERDIG 🚀</div>
  );

  return søkemodus ? (
    <Utfylling
      seksjon={seksjon}
      faktumlagrer={faktumlagrer}
      hentNesteSeksjon={() => hentNesteSeksjon(id)}
    />
  ) : (
    <Oppsummering />
  );
}
