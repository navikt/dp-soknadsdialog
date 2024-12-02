import { track } from "@amplitude/analytics-browser";

export function trackValgtEtLandFraOfteValgteLand(land: string, faktum: string) {
  track(`Valgt ${land} fra ofte valgte land`, { land, faktum });
}

export function trackValgtEtLandFraFlereLand(land: string, faktum: string) {
  track(`Valgt ${land} fra flere land`, { land, faktum });
}
