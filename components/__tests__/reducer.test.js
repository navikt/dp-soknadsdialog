import { useReducer } from "react";
import { act } from "@testing-library/react";

const initialState = {
  fakta: [
    {
      navn: "Ønsker dagpenger fra dato med id 2",
      id: 2,
      avhengigFakta: [],
      clazz: "localdate",
      roller: ["søker"],
    },
    {
      navn: "Fødselsdato med id 1",
      id: 1,
      avhengigFakta: [],
      clazz: "localdate",
      roller: ["søker"],
    },
    {
      navn: "Antall uker",
      id: 3,
      avhengigFakta: [],
      clazz: "int",
      roller: ["søker"],
    },
  ],
  seksjoner: [{ rolle: "søker", fakta: [2, 1] }],
  aktivSeksjon: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "endre-faktum":
      const fakta = state.fakta.map((faktum) => {
        if (faktum.id !== action.faktumId) return faktum;
        return { ...faktum, lagret: true };
      });
      return { ...state, ...fakta };
  }
};

function Test() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <input
        type="text"
        onChange={({ target: { value } }) =>
          dispatch({ type: "endre-faktum", faktumId: 123, value })
        }
      />
    </div>
  );
}

test("tull", () => {
  expect(1).toBe(1);
});
