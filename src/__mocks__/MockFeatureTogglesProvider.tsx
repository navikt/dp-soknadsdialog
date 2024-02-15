import React from "react";
import { FeatureTogglesContext } from "../context/feature-toggle-context";

interface IProps {
  children: React.ReactElement;
}

export function MockFeatureTogglesProvider({ children }: IProps) {
  return (
    <FeatureTogglesContext.Provider
      value={{
        arbeidsforholdIsEnabled: false,
      }}
    >
      {children}
    </FeatureTogglesContext.Provider>
  );
}
