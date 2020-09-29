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
  const seksjon1 = { id: 1, subsumsjoner: {}, fakta: [] };
  const action1 = leggTilNesteSeksjon(seksjon1);
  const state1 = reducer(undefined, action1);
  expect(getAktivSeksjon(state1)).toEqual(seksjon1);

  const seksjon2 = { id: 2, subsumsjoner: {}, fakta: [] };
  const action2 = leggTilNesteSeksjon(seksjon2);
  const state2 = reducer(state1, action2);
  expect(getAktivSeksjon(state2)).toEqual(seksjon2);

  const tilbakeAction = gåTilForrigeSeksjon();
  const state3 = reducer(state2, tilbakeAction);
  expect(getAktivSeksjon(state3)).toEqual(seksjon1);

  const state4 = reducer(state3, tilbakeAction);
  expect(getAktivSeksjon(state4)).toEqual(seksjon1);

  const state5 = reducer(state4, action2);
  expect(getAktivSeksjon(state5)).toEqual(seksjon2);
  expect(getSeksjoner(state5)).toHaveLength(5);

  const state6 = reducer(state5, tilbakeAction);
  const state7 = reducer(state6, tilbakeAction);
  const state8 = reducer(state7, tilbakeAction);
  expect(getSeksjoner(state8)).toHaveLength(8);
  expect(getAktivSeksjon(state8)).toEqual(seksjon2);
});

test("At seksjoner kun kan legge til på slutten", () => {});

test("At kan lage liste med unike seksjoner", () => {});
