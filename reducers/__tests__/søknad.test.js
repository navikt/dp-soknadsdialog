import reducer from "../søknad/reducer";
import { getSubsumsjoner } from "../søknad/selectors";
import { subsumsjonerHentet } from "../søknad/actions";

test("Reducer kan ta imot subsumsjoner", () => {
  const action = subsumsjonerHentet({});
  const state = reducer(undefined, action);
  expect(getSubsumsjoner(state)).toEqual({});
});
