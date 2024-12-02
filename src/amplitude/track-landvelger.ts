import { track } from "@amplitude/analytics-browser";

export function trackValgtEtLandFraOfteValgteLand(
  skjemanavn: string,
  land: string,
  faktum: string,
) {
  track(`Valgt ${land} fra ofte valgte land`, { skjemanavn, land, faktum });
}

export function trackValgtEtLandFraFlereLand(skjemanavn: string, land: string, faktum: string) {
  track(`Valgt ${land} fra flere land`, { skjemanavn, land, faktum });
}
