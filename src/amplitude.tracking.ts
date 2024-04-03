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
export function trackLagtTilArbeidsforholdManuelt(skjemanavn: string) {
  /* eslint-disable no-console */
  console.log(`🚀 lagt til arbeidsforhold manuelt`);
  track("lagt til arbeidsforhold manuelt", { skjemanavn });
}

export function trackValgtArbeidsforholdFraAAREG(skjemanavn: string) {
  /* eslint-disable no-console */
  console.log(`🚀 valgt arbeidsforhold fra aareg`);
  track("valgt arbeidsforhold fra aareg", { skjemanavn });
}

export function trackKorigertBedriftsnavnFraAAREG(skjemanavn: string) {
  /* eslint-disable no-console */
  console.log(`🚀 korrigert bedriftsnavn fra aareg`);
  track("korrigert bedriftsnavn fra aareg", { skjemanavn });
}

export function trackKorrigertStartdatoFraAAREG(skjemanavn: string) {
  /* eslint-disable no-console */
  console.log(`🚀 korrigert startdato fra aareg`);
  track("korrigert startdato fra aareg", { skjemanavn });
}

export function trackKorrigertSluttdatoFraAAREG(skjemanavn: string) {
  /* eslint-disable no-console */
  console.log(`🚀 korrigert sluttdato fra aareg`);
  track("korrigert sluttdato fra aareg", { skjemanavn });
}

export function tidStart(): Date {
  return new Date();
}

export function tidBruktSiden(start: Date): number {
  const slutt = new Date().getTime();
  return (slutt - start.getTime()) / 1000;
}
