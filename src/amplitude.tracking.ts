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
