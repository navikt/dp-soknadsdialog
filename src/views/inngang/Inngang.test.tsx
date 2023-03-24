import React from "react";
import { render, screen } from "@testing-library/react";
import { MockContext, mockSanityTexts } from "../../__mocks__/MockContext";
import { Inngang } from "./Inngang";
import { mockMineSoknader } from "../../__mocks__/mockdata/mineSoknader";

describe("Inngang", () => {
  test("Should show links to receipt for completed soknader", async () => {
    render(
      <MockContext
        sanityTexts={{
          ...mockSanityTexts,
          apptekster: [
            {
              textId: "inngang.send-dokument.knapp-tekst",
              valueText: "Send inn vedlegg til søknad sendt",
            },
          ],
        }}
      >
        <Inngang
          paabegynt={undefined}
          innsendte={mockMineSoknader?.innsendte}
          arbeidssokerStatus="REGISTERED"
        />
      </MockContext>
    );

    const completeApplication1 = screen.getByRole("link", {
      name: "Send inn vedlegg til søknad sendt 24.03.2023",
    });

    const completeApplication2 = screen.getByRole("link", {
      name: "Send inn vedlegg til søknad sendt 23.03.2023",
    });

    expect(completeApplication1).toHaveAttribute(
      "href",
      "/soknad/5171d9a5-ed5c-4d4f-8b33-9a9524c25cb7/kvittering"
    );

    expect(completeApplication2).toHaveAttribute(
      "href",
      "/soknad/623c03ba-ea07-44ba-90a2-f556246fedd7/kvittering"
    );
  });

  test("Should show link to continue already started application", async () => {
    render(
      <MockContext
        sanityTexts={{
          ...mockSanityTexts,
          apptekster: [
            {
              textId: "inngang.paabegyntsoknad.fortsett-paabegynt-knapp",
              valueText: "Fortsett påbegynt søknad",
            },
          ],
        }}
      >
        <Inngang
          paabegynt={mockMineSoknader?.paabegynt}
          innsendte={[]}
          arbeidssokerStatus="REGISTERED"
        />
      </MockContext>
    );

    const continueLink = screen.getByRole("link", {
      name: "Fortsett påbegynt søknad",
    });

    expect(continueLink).toHaveAttribute(
      "href",
      "/soknad/9bd8afdb-1576-4373-89a8-be653cc765fd?fortsett=true"
    );
  });
});
