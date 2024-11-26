import React, { createContext, PropsWithChildren } from "react";
import { ILandgruppe } from "../types/orkestrator.types";
import { defaultFeatureToggles, IFeatureToggles } from "../pages/api/common/unleash-api";

export interface IAppContext {
  landgrupper?: ILandgruppe[];
  featureToggles?: IFeatureToggles;
}

interface IProps {
  landgrupper?: ILandgruppe[];
  featureToggles?: IFeatureToggles;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

function AppProvider(props: PropsWithChildren<IProps>) {
  return (
    <AppContext.Provider
      value={{
        featureToggles: props.featureToggles || { ...defaultFeatureToggles },
        landgrupper: props.landgrupper,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}

function useOrkestratorIsEnabled() {
  const { featureToggles } = useAppContext();

  if (!featureToggles) {
    throw new Error(
      "FeatureToggles values missing in AppProvider. It might be missing or not initialized.",
    );
  }

  return featureToggles?.orkestratorEnEnabled && featureToggles?.orkestratorToEnabled;
}

export { AppProvider, useAppContext, useOrkestratorIsEnabled };
