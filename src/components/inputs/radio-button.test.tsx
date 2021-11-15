import React from 'react';
import { screen, render } from "@testing-library/react";

import { RadioButtonInput } from './radio-input.component'

describe('<RadioButtonInput/>', () => {
  const options = [
    { text: "Ja", value: "ja" },
    { text: "Nei", value: "nei" },
    { text: "Kanskje", value: "kanskje" }
  ];
  const props = {
    legend: "Test legend",
    options,
    onSelection: () => null
  }

  beforeEach(() => {
    render(<RadioButtonInput {...props} />);
  });


  it('should render the legend', async () => {
    expect(await screen.findByText("Test legend")).toBeInTheDocument();
  });

  it('should render the options passed in', async () => {
    const result = await screen.findAllByText(/Ja|Nei|Kanskje/);
    expect(result).toHaveLength(3);
  });
})
