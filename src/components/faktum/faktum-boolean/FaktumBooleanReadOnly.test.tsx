import { render, screen } from "@testing-library/react";
import React from "react";
import { booleanToTextId } from "./FaktumBoolean";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumBooleanReadOnly } from "./FaktumBooleanReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8007.1",
  type: "boolean",
  readOnly: false,
  gyldigeValg: [
    "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja",
    "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.nei",
  ],
  beskrivendeId: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
  sannsynliggjoresAv: [],
};

describe("FaktumBooleanReadOnly", () => {
  test("Should show faktum question and answer", async () => {
    const svar = false;
    const faktumToTest = { ...faktumMockData, svar: svar };
    const svarText = booleanToTextId(faktumToTest) || "";
    render(
      <MockContext>
        <FaktumBooleanReadOnly faktum={faktumToTest} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(svarText)).toBeInTheDocument;
  });
});
