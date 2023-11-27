import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { mockDokumentkravList } from "../../localhost-data/dokumentkrav-list";
import createFetchMock from "vitest-fetch-mock";

import { MockContext } from "../../__mocks__/MockContext";
import { DokumentkravItem } from "./DokumentkravItem";
import { GyldigDokumentkravSvar } from "../../types/documentation.types";

describe("DokumentkravItem", () => {
  const fetch = createFetchMock(vi);

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  test("Should show dokumentkrav title", async () => {
    render(
      <MockContext>
        <DokumentkravItem
          dokumentkrav={mockDokumentkravList.krav[0]}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading")).toHaveTextContent(
        mockDokumentkravList.krav[0].beskrivendeId
      );
    });
  });

  test("Should show dokumentkrav title and employer name for arbeidsforhold dokumentkrav", async () => {
    render(
      <MockContext dokumentkrav={mockDokumentkravList.krav}>
        <DokumentkravItem
          dokumentkrav={mockDokumentkravList.krav[0]}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await waitFor(() => {
      const dokumentkravTitle = `${mockDokumentkravList.krav[0].beskrivendeId} (${mockDokumentkravList.krav[0].beskrivelse})`;
      expect(screen.getByRole("heading")).toHaveTextContent(dokumentkravTitle);
    });
  });

  test("Should post answer when user answers dokumentkrav question", async () => {
    fetch.mockResponses(
      [JSON.stringify(mockDokumentkravList), { status: 200 }] // New dokumentkrav state from dp-soknad when user posts answer
    );

    const testDokumentkrav = { ...mockDokumentkravList.krav[0], svar: undefined };

    const user = userEvent.setup();

    render(
      <MockContext dokumentkrav={[testDokumentkrav]}>
        <DokumentkravItem
          dokumentkrav={testDokumentkrav}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

    await waitFor(() => {
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });

  test("Should show upload component when question has a specific answer", async () => {
    const user = userEvent.setup();

    render(
      <MockContext dokumentkrav={mockDokumentkravList.krav}>
        <DokumentkravItem
          dokumentkrav={mockDokumentkravList.krav[0]}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

    await waitFor(() => {
      expect(screen.queryByTestId("dropzone")).toBeInTheDocument();
    });
  });

  test("Should show additional input field begrunnelse if user chooses not to upload documentation", async () => {
    const user = userEvent.setup();

    render(
      <MockContext dokumentkrav={mockDokumentkravList.krav}>
        <DokumentkravItem
          dokumentkrav={mockDokumentkravList.krav[0]}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SENDER_IKKE));

    await waitFor(() => {
      expect(
        screen.getByLabelText("faktum.dokument.dokumentkrav.svar.sender.ikke.begrunnelse")
      ).toBeInTheDocument();
    });
  });

  test("Should post begrunnelse when user answers dokumentkrav begrunnelse", async () => {
    fetch.mockResponses(
      [JSON.stringify(mockDokumentkravList), { status: 200 }] // New dokumentkrav state from dp-soknad when user posts begrunnelse
    );

    const testDokumentkrav = {
      ...mockDokumentkravList.krav[0],
      svar: DOKUMENTKRAV_SVAR_SENDER_IKKE as GyldigDokumentkravSvar,
      begrunnelse: undefined,
    };

    const user = userEvent.setup();

    render(
      <MockContext dokumentkrav={[testDokumentkrav]}>
        <DokumentkravItem
          dokumentkrav={testDokumentkrav}
          hasBundleError={false}
          hasUnansweredError={false}
          resetError={vi.fn()}
        />
      </MockContext>
    );

    await user.type(
      screen.getByLabelText("faktum.dokument.dokumentkrav.svar.sender.ikke.begrunnelse"),
      "En begrunnelse her"
    );

    await waitFor(() => {
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });
});
