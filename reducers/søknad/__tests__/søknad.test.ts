import reducer, { initialState } from "../reducer";
import {
  faktumLagret,
  gåTilForrigeSeksjon,
  leggTilNesteSeksjon,
} from "../actions";
import { getAktivSeksjon, getSeksjoner } from "../selectors";

test("Reducer kan ta imot neste seksjon", () => {
  const action1 = leggTilNesteSeksjon(seksjon(1));
  const state1 = reducer(undefined, action1);

  const action2 = leggTilNesteSeksjon(seksjon(2));
  const state2 = reducer(state1, action2);
  expect(getAktivSeksjon(state2)).toEqual(seksjon(2));
  expect(getSeksjoner(state2)).toHaveLength(2);
});

test("At du kan navigere tilbake i seksjoner du har svart på", () => {
  const action1 = leggTilNesteSeksjon(seksjon(1));
  const state1 = reducer(undefined, action1);
  expect(getAktivSeksjon(state1)).toEqual(seksjon(1));

  const action2 = leggTilNesteSeksjon(seksjon(2));
  const state2 = reducer(state1, action2);
  expect(getAktivSeksjon(state2)).toEqual(seksjon(2));

  const tilbakeAction = gåTilForrigeSeksjon();
  const state3 = reducer(state2, tilbakeAction);
  expect(getAktivSeksjon(state3)).toEqual(seksjon(1));

  const state4 = reducer(state3, tilbakeAction);
  expect(getAktivSeksjon(state4)).toEqual(seksjon(1));

  const state5 = reducer(state4, action2);
  expect(getAktivSeksjon(state5)).toEqual(seksjon(2));
  expect(getSeksjoner(state5)).toHaveLength(5);

  const state6 = reducer(state5, tilbakeAction);
  const state7 = reducer(state6, tilbakeAction);
  const state8 = reducer(state7, tilbakeAction);
  expect(getSeksjoner(state8)).toHaveLength(8);
  expect(getAktivSeksjon(state8)).toEqual(seksjon(2));
});

test("når faktum lagres oppdateres seksjonen", () => {
  const state = reducer(
    {
      ...initialState,
      seksjoner: [seksjon(1), seksjon(2), seksjon(3)],
    },
    faktumLagret(seksjon(3))
  );

  expect(getAktivSeksjon(state)).toEqual(seksjon(3));
  const state2 = reducer(state, gåTilForrigeSeksjon());
  const state3 = reducer(state2, faktumLagret(seksjon(2)));
  expect(getAktivSeksjon(state3)).toEqual(seksjon(2));
});

const seksjon = (id) => ({
  fakta: [],
  id,
  subsumsjoner: {},
});
