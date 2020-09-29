import Seksjon from "./seksjon";
import reducer from "../reducers/søknad";
import { faktumLagret, leggTilNesteSeksjon } from "../reducers/søknad/actions";
import { getAktivSeksjon } from "../reducers/søknad/selectors";
import { useEffect, useReducer } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Søknad({ id }) {
  const [state, dispatch] = useReducer(reducer, {
    seksjoner: [],
    tilbakeTeller: 0,
  });

  const hentNesteSeksjon = async (søknadId) => {
    const nesteSeksjon = await fetcher(
      `${process.env.NEXT_PUBLIC_API_URL}/soknad/${søknadId}/neste-seksjon`
    );

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

  if (typeof seksjon === "undefined") return null;

  return (
    <>
      <Seksjon
        fakta={seksjon.fakta}
        faktumlagrer={faktumlagrer}
        hentNesteSeksjon={() => hentNesteSeksjon(id)}
      />
    </>
  );
}
