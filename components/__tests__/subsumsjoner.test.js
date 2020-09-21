import { render } from "@testing-library/react";
import Subsumsjoner from "../subsumsjoner";

test("Hent subsumsjoner", async () => {
    const { findAllByTestId } = render(<Subsumsjoner />);

    expect(await findAllByTestId(/subsumsjon/)).toHaveLength(7);
});