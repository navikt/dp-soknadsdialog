import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumText } from "./FaktumText";
import { IQuizTekstFaktum, IQuizSeksjon } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { SetupContext } from "../../__mocks__/SetupContext";

const faktumMockData: IQuizTekstFaktum = {
  id: "8004.1",
  svar: "as",
  type: "tekst",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
  sannsynliggjoresAv: [],
  roller: [],
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("FaktumText", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumText faktum={faktumMockData} />
      </SetupContext>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should show faktum answer if already answered", async () => {
    const svar = "Hei på du";
    faktumMockData.svar = svar;

    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumText faktum={faktumMockData} />
      </SetupContext>
    );

    // Casting it to access the value attribute
    const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(textInput.value).toBe(svar);
    });
  });

  describe("When user inputs an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = "Hei på du";
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumText faktum={faktumMockData} onChange={onchange} />
        </SetupContext>
      );

      const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(textInput, svar);

      await waitFor(() => {
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });

    test.skip("Should show error on invalid input", async () => {
      const inValidTextLengthMock =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like.";
      const errorTextKey = "validering.text-faktum.for-lang-tekst";
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumText faktum={faktumMockData} onChange={onchange} />
        </SetupContext>
      );

      const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(textInput, inValidTextLengthMock);

      await waitFor(() => {
        expect(textInput.value).toEqual(inValidTextLengthMock);
        expect(onchange).toHaveBeenCalledTimes(0);
        const errorText = screen.getByText(errorTextKey);
        expect(errorText).toBeInTheDocument();
      });
    });
  });
});
