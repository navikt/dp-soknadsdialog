import { init, track } from "@amplitude/analytics-browser";

export const initAmplitude = () => {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") return;

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
export function trackLagtTilArbeidsforholdManuelt(skjemaNavn: string) {
  track("lagt til arbeidsforhold manuelt", { skjemaNavn });
}

export function trackValgtArbeidsforholdFraAAREG(skjemaNavn: string) {
  track("valgt arbeidsforhold fra aareg", { skjemaNavn });
}

export function trackKorigertBedriftsnavnFraAAREG(skjemaNavn: string) {
  track("korrigert bedriftsnavn fra aareg", { skjemaNavn });
}

export function trackKorrigertStartdatoFraAAREG(skjemaNavn: string) {
  track("korrigert startdato fra aareg", { skjemaNavn });
}

export function trackKorrigertSluttdatoFraAAREG(skjemaNavn: string) {
  track("korrigert sluttdato fra aareg", { skjemaNavn });
}

export function tidStart(): Date {
  return new Date();
}

export function tidBruktSiden(start: Date): number {
  const slutt = new Date().getTime();
  return (slutt - start.getTime()) / 1000;
}
