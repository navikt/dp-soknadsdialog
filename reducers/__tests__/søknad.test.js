import reducer from "../søknad/reducer";
import { getFakta, getSubsumsjoner } from "../søknad/selectors";
import { subsumsjonerHentet } from "../søknad/actions";

test("Reducer kan ta imot subsumsjoner", () => {
  const action1 = subsumsjonerHentet({});
  const state1 = reducer(undefined, action1);
  expect(getSubsumsjoner(state1)).toEqual({});

  const subsumsjoner = { ett: "ellerannet" };
  const action2 = subsumsjonerHentet(subsumsjoner, [1, 2, 3]);
  const state2 = reducer(state1, action2);
  expect(getSubsumsjoner(state2)).toEqual(subsumsjoner);
  expect(getFakta(state2)).toHaveLength(3);
});
