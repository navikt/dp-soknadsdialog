import { logger } from "@navikt/next-logger";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

export interface IFeatureToggles {
  arbeidsforhold?: boolean;
  brukerdialogGradvisProdsetting?: boolean;
}

export const defaultFeatureToggles = {
  arbeidsforhold: false,
  brukerdialogGradvisProdsetting: false,
};

export async function getFeatureToggles(): Promise<IFeatureToggles> {
  const featureToggles = { ...defaultFeatureToggles };

  try {
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions);
    const flags = flagsClient(toggles);

    featureToggles.arbeidsforhold = flags.isEnabled("dp-soknadsdialog.arbeidsforhold");
    featureToggles.brukerdialogGradvisProdsetting = flags.isEnabled(
      "dp-soknadsdialog.brukerdialog-gradvis-prodsetting",
    );

    return featureToggles;
  } catch (error) {
    logger.error(`Unleash error: ${error}`);

    return featureToggles;
  }
}
