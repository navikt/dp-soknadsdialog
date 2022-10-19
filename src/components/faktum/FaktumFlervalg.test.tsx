import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import { IQuizState } from "../../localhost-data/quiz-state-response";
import fetch from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "3008",
  type: "flervalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet",
  ],
  beskrivendeId: "faktum.eget-gaardsbruk-type-gaardsbruk",
  sannsynliggjoresAv: [],
};

const lagreFaktumMock = { status: "ok", sistBesvart: "123" };

const nesteMockData = {
  ferdig: false,
  seksjoner: [
    {
      fakta: [faktumMockData],
      beskrivendeId: "gjenopptak",
      ferdig: true,
    },
  ],
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};

const soknadStateMockData: IQuizState = {
  ferdig: false,
  seksjoner: [sectionMockData],
};

describe("FaktumFlervalg", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test.skip("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumFlervalg faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[2])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[3])).toBeInTheDocument();
    });
  });

  test.skip("Should show preselected faktum answer if it's already selected", async () => {
    const svar: string[] = [];
    svar.push(faktumMockData.gyldigeValg[1]);
    svar.push(faktumMockData.gyldigeValg[2]);
    faktumMockData.svar = svar;

    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumFlervalg faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.queryAllByRole("checkbox", { checked: true }) as HTMLInputElement[];

    await waitFor(() => {
      expect(checkedRadio[0].value).toBe(svar[0]);
      expect(checkedRadio[1].value).toBe(svar[1]);
    });
  });

  describe("When user selects an answer", () => {
    beforeEach(() => {
      fetch.enableMocks();
    });

    afterEach(() => {
      fetch.mockReset();
    });

    test.skip("Should post the answer to the server", async () => {
      // First save the answer
      fetch.mockResponseOnce(JSON.stringify(lagreFaktumMock));
      // Then get next question (if any)
      fetch.mockResponseOnce(JSON.stringify(nesteMockData));

      const user = userEvent.setup();
      const svar = [faktumMockData.gyldigeValg[1]];

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumFlervalg faktum={faktumMockData} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const svarCheckbox = screen.getByLabelText(svar[0]);

      user.click(svarCheckbox);

      await waitFor(() => {
        const checkedCheckbox = screen.getByRole("checkbox", {
          checked: true,
        }) as HTMLInputElement;
        expect(checkedCheckbox).toBeInTheDocument();
        expect(checkedCheckbox.value).toEqual(svar[0]);
        expect(fetch.mock.calls.length).toEqual(2);

        // Does the first call save the faktum with the right answer?
        const putRequestBody = fetch.mock.calls[0][1]?.body as string;
        const requestJson = JSON.parse(putRequestBody);

        expect(requestJson.beskrivendeId).toBe(faktumMockData.beskrivendeId);
        expect(requestJson.svar.length).toBe(1);
        expect(requestJson.svar[0]).toBe(svar[0]);
      });
    });

    test.skip("Can select multiple answers", async () => {
      // First save the answer
      fetch.mockResponseOnce(JSON.stringify(lagreFaktumMock));
      // Then get next question (if any)
      fetch.mockResponseOnce(JSON.stringify(nesteMockData));
      // Save the answer again (second checkbox checked)
      fetch.mockResponseOnce(JSON.stringify(lagreFaktumMock));
      // Then get next question (if any)
      fetch.mockResponseOnce(JSON.stringify(nesteMockData));

      const user = userEvent.setup();
      const svar = [faktumMockData.gyldigeValg[1], faktumMockData.gyldigeValg[2]];

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumFlervalg faktum={faktumMockData} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const svar1Checkbox = screen.getByLabelText(svar[0]);
      user.click(svar1Checkbox);

      const svar2Checkbox = screen.getByLabelText(svar[1]);
      user.click(svar2Checkbox);

      await waitFor(() => {
        const checkedCheckboxes = screen.getAllByRole("checkbox", {
          checked: true,
        }) as HTMLInputElement[];
        expect(checkedCheckboxes[0]).toBeInTheDocument();
        expect(checkedCheckboxes[0].value).toEqual(svar[0]);

        expect(checkedCheckboxes[1]).toBeInTheDocument();
        expect(checkedCheckboxes[1].value).toEqual(svar[1]);

        expect(fetch.mock.calls.length).toEqual(4);

        // Does the second save request update the faktum with the right answer?
        const putRequestBody = fetch.mock.calls[2][1]?.body as string;
        const requestJson = JSON.parse(putRequestBody);

        expect(requestJson.beskrivendeId).toBe(faktumMockData.beskrivendeId);
        expect(requestJson.svar.length).toBe(2);
        expect(requestJson.svar[0]).toBe(svar[0]);
        expect(requestJson.svar[1]).toBe(svar[1]);
      });
    });
  });
});
