import { groq } from "next-sanity";

const seksjonFields = `{
  textId,
  title,
  description,
  helpText,
}`;

const faktumFields = `{
  textId,
  text,
  description,
  helpText,
  errorMessage,
  unit,
  alertText,
}`;

const svaralternativFields = `{
  textId,
  text,
  alertText,
}`;

const landGruppeFields = `{
  textId,
  alertText,
}`;

const appTextsFields = `{
  textId,
  valueText
}`;

const infosideFields = `{
  "slug": slug.current,
  body
}`;

const dokumentkravFields = `{
  textId,
  title,
  description,
  helpText,
}`;

const dokumentkravSvarFields = `{
  textId,
  text,
  alertText,
}`;

const seksjonerGroq = `* [_type=="seksjon" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${seksjonFields}, ${seksjonFields})
}`;

const faktaGroq = `* [_type=="faktum" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${faktumFields}, ${faktumFields})
}`;

const svaralternativerGroq = `* [_type=="svaralternativ" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${svaralternativFields}, ${svaralternativFields})
}`;

const landGrupperGroq = `* [_type=="landgruppe" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${landGruppeFields}, ${landGruppeFields})
}`;

const appTextsGroq = `* [_type=="apptekst" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${appTextsFields}, ${appTextsFields})
}`;

const infosiderGroq = `* [_type=="infopage"  && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${infosideFields}, ${infosideFields})
}`;

const dokumentkravGroq = `* [_type=="dokumentkrav" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${dokumentkravFields}, ${dokumentkravFields})
}`;

const dokumentkravSvarGroq = `* [_type=="dokumentkravSvar" && language==$baseLang]{
  ...coalesce(* [_id==^._id + language==$lang][0]${dokumentkravFields}, ${dokumentkravSvarFields})
}`;

export const allTextsQuery = groq`{
  "seksjoner": ${seksjonerGroq},
  "fakta": ${faktaGroq},
  "svaralternativer": ${svaralternativerGroq},
  "landgrupper": ${landGrupperGroq},
  "apptekster": ${appTextsGroq},
  "dokumentkrav": ${dokumentkravGroq},
  "dokumentkravSvar": ${dokumentkravSvarGroq},
  "infosider": ${infosiderGroq}
}`;
