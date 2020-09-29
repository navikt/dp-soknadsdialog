import reducer from "../søknad/reducer";
import { gåTilForrigeSeksjon, leggTilNesteSeksjon } from "../søknad/actions";
import { getAktivSeksjon, getSeksjoner } from "../søknad/selectors";

test("Reducer kan ta imot neste seksjon", () => {
  const seksjon1 = { subsumsjoner: {}, fakta: [] };
  const action1 = leggTilNesteSeksjon(seksjon1);
  const state1 = reducer(undefined, action1);


  const seksjon2 = { subsumsjoner: {}, fakta: [] };
  const action2 = leggTilNesteSeksjon(seksjon2);
  const state2 = reducer(state1, action2);
  expect(getAktivSeksjon(state2)).toEqual(seksjon2);
  expect(getSeksjoner(state2)).toHaveLength(2);
});

test("At du kan navigere tilbake i seksjoner du har svart på", () => {
  const seksjon1 = { subsumsjoner: {}, fakta: [] };
  const action1 = leggTilNesteSeksjon(seksjon1);
  const state1 = reducer(undefined, action1);
  expect(getAktivSeksjon(state1)).toEqual(seksjon1);

  const seksjon2 = { subsumsjoner: {}, fakta: [] };
  const action2 = leggTilNesteSeksjon(seksjon2);
  const state2 = reducer(state1, action2);
  expect(getAktivSeksjon(state2)).toEqual(seksjon2);

  const tilbakeAction = gåTilForrigeSeksjon();
  const state3 = reducer(state2, tilbakeAction);
  expect(getAktivSeksjon(state3)).toEqual(seksjon1);
});

test("At seksjoner kun kan legge til på slutten", () => {});

test("At kan lage liste med unike seksjoner", () => {});
