import { logger } from "@navikt/next-logger";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

export interface IFeatureToggles {
  soknadsdialogMedOrkestratorIsEnabled: boolean;
}

export const defaultFeatureToggles = {
  soknadsdialogMedOrkestratorIsEnabled: false,
};

export async function getFeatureToggles(): Promise<IFeatureToggles> {
  const featureToggles = { ...defaultFeatureToggles };

  try {
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions);
    const flags = flagsClient(toggles);

    featureToggles.soknadsdialogMedOrkestratorIsEnabled = flags.isEnabled(
      "dp-soknadsdialog-med-dp-soknad-orkestrator",
    );

    return featureToggles;
  } catch (error) {
    logger.error(`Unleash error: ${error}`);

    return featureToggles;
  }
}
