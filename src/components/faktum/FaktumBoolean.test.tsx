import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { booleanToTextId, FaktumBoolean, textIdToBoolean } from "./FaktumBoolean";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

import * as SentryLogger from "../../sentry.logger";

//jest.mock("../../sentry.logger");

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

const soknadStateMockData: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [sectionMockData],
};

describe("FaktumBoolean", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumBoolean faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
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
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumBoolean faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
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
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumBoolean faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
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
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumBoolean faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
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
