import { addYears } from "date-fns";

export const ARBEIDSFORHOLD_FAKTUM_ID = "faktum.arbeidsforhold";
export const BARN_LISTE_FAKTUM_ID = "faktum.barn-liste";
export const BARN_LISTE_REGISTER_FAKTUM_ID = "faktum.register.barn-liste";
export const ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID = "faktum.arbeidsforhold.navn-bedrift";

export const DOKUMENTKRAV_SVAR_SEND_NAA = "dokumentkrav.svar.send.naa";
export const DOKUMENTKRAV_SVAR_SENDER_IKKE = "dokumentkrav.svar.sender.ikke";
export const DOKUMENTKRAV_SVAR_SENDER_SENERE = "dokumentkrav.svar.send.senere";
export const DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE = "dokumentkrav.svar.andre.sender";
export const DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE = "dokumentkrav.svar.sendt.tidligere";

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ALLOWED_FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
export const MAX_TOTAL_DOKUMENTKRAV_FILE_SIZE = 52428800; // 50mb in bytes

export const MAX_TEXT_LENGTH = 500;

export const DATEPICKER_MIN_DATE = new Date("1900-01-01");
export const DATEPICKER_MAX_DATE = addYears(new Date(), 100);

export const TEXTAREA_FAKTUM_IDS = [
  "faktum.reist-tilbake-periode",
  "faktum.arbeidsforhold.tilleggsopplysninger",
  "faktum.arbeidsforhold.vet-du-aarsak-til-sagt-opp-av-arbeidsgiver",
  "faktum.arbeidsforhold.vet-du-aarsak-til-redusert-arbeidstid",
  "faktum.arbeidsforhold.aarsak-til-du-sa-opp",
  "faktum.arbeidsforhold.aarsak-til-ikke-akseptert-tilbud",
  "faktum.arbeidsforhold.hva-er-aarsak-til-avskjediget",
  "faktum.eget-gaardsbruk-arbeidstimer-beregning",
  "faktum.kort-om-hvorfor-kun-deltid",
  "faktum.kort-om-hvorfor-ikke-jobbe-hele-norge",
  "faktum.tilleggsopplysninger",
];

export const QUIZ_SOKNADSTYPE_DAGPENGESOKNAD = "Dagpenger";
