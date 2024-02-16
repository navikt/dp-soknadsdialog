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

export function tidStart(): Date {
  return new Date();
}

export function tidBruktSiden(start: Date): number {
  const slutt = new Date().getTime();
  return (slutt - start.getTime()) / 1000;
}

// Arbeidsforhold

export function trackLeggTilArbeidsforholdManuelt() {
  track("lagt til arbeidsforhold manuelt");
}

export function trackAAREGArbeidsforholdBleValgt() {
  track("aareg arbeidsforhold ble valgt");
}

export function trackAAREGArbeidsforholdBedriftsnavnKorigert(bedriftsnavn: string) {
  track("aareg arbeidsforhold bedriftsnavn korrigert", {
    bedriftsnavn,
  });
}

export function trackAAREGArbeidsforholdFOMKorigert(bedriftsnavn: string) {
  track("aareg arbeidsforhold tom dato korrigert", {
    bedriftsnavn,
  });
}

export function trackAAREGArbeidsforholdTOMKorigert(bedriftsnavn: string) {
  track("aareg arbeidsforhold tom dato korrigert", {
    bedriftsnavn,
  });
}
