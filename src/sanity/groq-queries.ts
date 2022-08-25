import { groq } from "next-sanity";

function getSeksjonFields(usePlainText: boolean) {
  return `{
  textId,
  title,
  ${usePlainText ? '"description": pt::text(description)' : "description"},
  helpText,
  helpText != null => {
    "helpText": {
      ...helpText, ${usePlainText ? '"body": pt::text(helpText.body)' : '"body": helpText.body'}
    }
  },
}`;
}

function getFaktumFields(usePlainText: boolean) {
  return `{
  textId,
  text,
  ${usePlainText ? '"description": pt::text(description)' : "description"},
  helpText,
  helpText != null => {
    "helpText": {
      ...helpText, ${usePlainText ? '"body": pt::text(helpText.body)' : '"body": helpText.body'}
    }
  },
  unit
}`;
}

function getSvaralternativFields(usePlainText: boolean) {
  return `{
  textId,
  text,
  alertText,
  alertText != null => {
    "alertText": {
      ...alertText, ${usePlainText ? '"body": pt::text(alertText.body)' : '"body": alertText.body'}
    }
  },
}`;
}

function getlandGruppeFields(usePlainText: boolean) {
  return `{
  textId,
  alertText,
  alertText != null => {
    "alertText": {
      ...alertText, ${usePlainText ? '"body": pt::text(alertText.body)' : '"body": alertText.body'}
    }
  },
}`;
}

function getAppTextsFields() {
  return `{
  textId,
  valueText
}`;
}

function getInfosideFields() {
  return `{
  "slug": slug.current,
  body
}`;
}

function getDokumentkravFields(usePlainText: boolean) {
  return `{
  textId,
  text,
  ${usePlainText ? '"description": pt::text(description)' : "description"},
  helpText,
  helpText != null => {
    "helpText": {
      ...helpText, ${usePlainText ? '"body": pt::text(helpText.body)' : '"body": helpText.body'}
    }
  },
}`;
}

function getDokumentkravSvarFields(usePlainText: boolean) {
  return `{
  textId,
  text,
  alertText,
  alertText != null => {
    "alertText": {
      ...alertText, ${usePlainText ? '"body": pt::text(alertText.body)' : '"body": alertText.body'}
    }
  },
}`;
}

function getSeksjonerGroq(usePlainText: boolean) {
  return `* [_type=="seksjon" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getSeksjonFields(
    usePlainText
  )}, ${getSeksjonFields(usePlainText)})
}`;
}

function getFaktaGroq(usePlainText: boolean) {
  return `* [_type=="faktum" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getFaktumFields(
    usePlainText
  )}, ${getFaktumFields(usePlainText)})
}`;
}

function getSvaralternativerGroq(usePlainText: boolean) {
  return `* [_type=="svaralternativ" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getSvaralternativFields(
    usePlainText
  )}, ${getSvaralternativFields(usePlainText)})
}`;
}

function getLandGrupperGroq(usePlainText: boolean) {
  return `* [_type=="landgruppe" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getlandGruppeFields(
    usePlainText
  )}, ${getlandGruppeFields(usePlainText)})
}`;
}

function getAppTextsGroq() {
  return `* [_type=="apptekst" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAppTextsFields()}, ${getAppTextsFields()})
  }`;
}

function getInfosiderGroq() {
  return `* [_type=="infopage"  && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getInfosideFields()}, ${getInfosideFields()})
  }`;
}

function getDokumentkravGroq(usePlainText: boolean) {
  return `* [_type=="dokumentkrav" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getDokumentkravFields(
    usePlainText
  )}, ${getDokumentkravFields(usePlainText)})
  }`;
}

function getDokumentkravSvarGroq(usePlainText: boolean) {
  return `* [_type=="dokumentkravSvar" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getDokumentkravFields(
    usePlainText
  )}, ${getDokumentkravSvarFields(usePlainText)})
  }`;
}

export const allTextsQuery = groq`{
  "seksjoner": ${getSeksjonerGroq(false)},
  "fakta": ${getFaktaGroq(false)},
  "svaralternativer": ${getSvaralternativerGroq(false)},
  "landgrupper": ${getLandGrupperGroq(false)},
  "apptekster": ${getAppTextsGroq()},
  "dokumentkrav": ${getDokumentkravGroq(false)},
  "dokumentkravSvar": ${getDokumentkravSvarGroq(false)},
  "infosider": ${getInfosiderGroq()}
}`;

export const allTextsPlainQuery = groq`{
  "seksjoner": ${getSeksjonerGroq(true)},
  "fakta": ${getFaktaGroq(true)},
  "svaralternativer": ${getSvaralternativerGroq(true)},
  "landgrupper": ${getLandGrupperGroq(true)},
  "apptekster": ${getAppTextsGroq()}
}`;
