import { init, track } from "@amplitude/analytics-browser";

export const initAmplitude = () => {
  init("default", undefined, {
    useBatch: true,
    serverUrl: "https://amplitude.nav.no/collect-auto",
    ingestionMetadata: {
      sourceName: window.location.toString(),
    },
  });
};

export function trackSkjemaStartet(skjemanavn: string, skjemaId: string) {
  track("skjema startet", {
    skjemanavn,
    skjemaId,
  });
}

export function trackSkjemaÅpnet(skjemanavn: string, skjemaId: string) {
  track("skjema åpnet", {
    skjemanavn,
    skjemaId,
  });
}

export function trackSkjemaStegFullført(skjemanavn: string, skjemaId: string, steg: number) {
  track("skjema steg fullført", {
    skjemanavn,
    skjemaId,
    steg,
  });
}

export function trackSkjemaFullført(skjemanavn: string, skjemaId: string) {
  track("skjema fullført", {
    skjemanavn,
    skjemaId,
  });
}

export function trackDokumentasjonLastetOpp(antallFiler: number, sekundBrukt: number) {
  track("dokumentasjon lastet opp", {
    antallFiler,
    sekundBrukt,
  });
}

// Arbeidsforhold
export function trackLagtTilArbeidsforholdManuelt() {
  track("lagt til arbeidsforhold manuelt");
}

export function trackValgtArbeidsforholdFraAAREG() {
  track("valgt arbeidsforhold fra aareg");
}

export function trackKorigertBedriftsnavnFraAAREG() {
  track("korrigert bedriftsnavn fra aareg");
}

export function trackKorrigertStartdatoFraAAREG() {
  track("korrigert startdato fra aareg");
}

export function trackKorrigertSluttdatoFraAAREG() {
  track("korrigert sluttdato fra aareg");
}

export function tidStart(): Date {
  return new Date();
}

export function tidBruktSiden(start: Date): number {
  const slutt = new Date().getTime();
  return (slutt - start.getTime()) / 1000;
}
