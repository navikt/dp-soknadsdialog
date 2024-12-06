import { track } from "@amplitude/analytics-browser";

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
