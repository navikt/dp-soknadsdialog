import { track } from "@amplitude/analytics-browser";

export function trackValgtEtLandFraOfteValgteLand(skjemanavn: string, land: string) {
  track(`Valgt et fra ofte valgte land listen`, { skjemanavn, land });
}

export function trackValgtEtLandFraFlereLand(skjemanavn: string, land: string) {
  track(`Valgt et fra flere land listen`, { skjemanavn, land });
}
