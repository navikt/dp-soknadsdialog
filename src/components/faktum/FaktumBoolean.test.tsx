import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { booleanToTextId, FaktumBoolean, textIdToBoolean } from "./FaktumBoolean";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";

import * as SentryLogger from "../../sentry.logger";
import { SetupContext } from "../../__mocks__/SetupContext";

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

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("FaktumBoolean", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumBoolean faktum={faktumMockData} />
      </SetupContext>
    );
    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    faktumMockData.svar = true;

    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumBoolean faktum={faktumMockData} />
      </SetupContext>
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.getByRole("radio", { checked: true }) as HTMLInputElement;
    const svarLabel = booleanToTextId(faktumMockData);

    await waitFor(() => {
      expect(checkedRadio.value).toBe("faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja");
      expect(svarLabel).toBe("faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja");
    });
  });

  xtest("Should not look for empty textId when rendering unanswered readOnly", async () => {
    const spy = jest.spyOn(SentryLogger, "logMissingSanityText");
    faktumMockData.svar = undefined;
    faktumMockData.readOnly = true;

    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumBoolean faktum={faktumMockData} />
      </SetupContext>
    );

    expect(spy).not.toHaveBeenCalledWith("");
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = faktumMockData.gyldigeValg[1];
      const booleanSvar = textIdToBoolean(svar);
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumBoolean faktum={faktumMockData} onChange={onchange} />
        </SetupContext>
      );

      const radioToClick = screen.getByLabelText(svar);

      user.click(radioToClick);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, booleanSvar);
      });
    });
  });
});
