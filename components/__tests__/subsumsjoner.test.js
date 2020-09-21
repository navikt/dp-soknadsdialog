import { render } from "@testing-library/react";

test("Hent subsumsjoner", async () => {
    const { findByText } = render(<Subsumsjoner />);

    expect(await findByText("Subsumsjoner")).toBeInTheDocument();
});