import { logger } from "@navikt/next-logger";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

export interface IFeatureToggles {
  arbeidsforholdIsEnabled: boolean;
}

export const defaultFeatureToggles = {
  arbeidsforholdIsEnabled: false,
};

export async function getFeatureToggles(): Promise<IFeatureToggles> {
  const featureToggles = { ...defaultFeatureToggles };

  try {
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions);
    const flags = flagsClient(toggles);

    featureToggles.arbeidsforholdIsEnabled = flags.isEnabled("dp-soknadsdialog-arbeidsforhold");

    return featureToggles;
  } catch (error) {
    logger.error(`Unleash error: ${error}`);

    return featureToggles;
  }
}
