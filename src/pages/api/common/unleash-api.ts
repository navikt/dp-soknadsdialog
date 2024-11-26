import { logger } from "@navikt/next-logger";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

export interface IFeatureToggles {
  orkestratorEnEnabled: boolean;
  orkestratorToEnabled: boolean;
}

export const defaultFeatureToggles = {
  orkestratorEnEnabled: false,
  orkestratorToEnabled: false,
};

export async function getFeatureToggles(): Promise<IFeatureToggles> {
  const featureToggles = { ...defaultFeatureToggles };

  try {
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions);
    const flags = flagsClient(toggles);

    featureToggles.orkestratorEnEnabled = flags.isEnabled("dp-soknadsdialog-orkestrator-en");
    featureToggles.orkestratorToEnabled = flags.isEnabled("dp-soknadsdialog-orkestrator-to");

    return featureToggles;
  } catch (error) {
    logger.error(`Unleash error: ${error}`);

    return featureToggles;
  }
}
