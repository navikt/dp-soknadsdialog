import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { ReceiptUploadDocuments } from "./ReceiptUploadDocuments";
import { sub, formatISO } from "date-fns";
import { MockContext } from "../../__mocks__/MockContext";
import { ISoknadStatus } from "../../types/quiz.types";

const soknadStatusMock: ISoknadStatus = {
  status: "UnderBehandling",
  opprettet: "2022-10-21T09:42:37.291157",
  innsendt: "2022-10-21T09:47:29",
};

test("Should show link to ettersending if soknad is sent in within 12 weeks", async () => {
  const innsendt = new Date();

  render(
    <MockContext>
      <ReceiptUploadDocuments
        soknadStatus={{ ...soknadStatusMock, innsendt: formatISO(innsendt) }}
      />
    </MockContext>,
  );

  await waitFor(() => {
    expect(screen.getByRole("link")).toHaveAttribute("href", "/soknad/localhost-uuid/ettersending");
  });
});

describe("ReceiptUploadDocuments", () => {
  test("Should show link to generell innsending if outside of 12 weeks since sent in", async () => {
    const innsendt = new Date();
    const outsideEttersendingBoundary = sub(innsendt, { weeks: 13 });

    render(
      <MockContext>
        <ReceiptUploadDocuments
          soknadStatus={{ ...soknadStatusMock, innsendt: formatISO(outsideEttersendingBoundary) }}
        />
      </MockContext>,
    );

    await waitFor(() => {
      expect(screen.getByRole("link")).toHaveAttribute("href", "/generell-innsending");
    });
  });
});
