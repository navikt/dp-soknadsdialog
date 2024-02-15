import React, { PropsWithChildren, createContext, useState } from "react";
import { IFeatureToggles, defaultFeatureToggles } from "../api/unleash-api";

export const FeatureTogglesContext = createContext<IFeatureToggles | null>(null);

function FeatureTogglesProvider(props: PropsWithChildren<{ featureToggles: IFeatureToggles }>) {
  const [featureToggles] = useState<IFeatureToggles>(
    props.featureToggles || { ...defaultFeatureToggles },
  );

  return (
    <FeatureTogglesContext.Provider value={featureToggles}>
      {props.children}
    </FeatureTogglesContext.Provider>
  );
}

function useFeatureToggles() {
  const context = React.useContext(FeatureTogglesContext);

  if (!context) {
    throw new Error("useUserInformation must be used within a UserInformationProvider");
  }

  return context;
}

export { FeatureTogglesProvider, useFeatureToggles };
