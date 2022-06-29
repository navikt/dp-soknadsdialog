import { groq } from "next-sanity";

const seksjonFields = `{
  textId,
  title,
  description,
  helpText
}`;

const faktumFields = `{
  textId,
  text,
  description,
  helpText,
  unit
}`;

const svaralternativFields = `{
  textId,
  text,
  alertText
}`;

const landGruppeFields = `{
  textId,
  alertText
}`;

const appTekstFields = `{
  textId,
  valueText
}`;

const seksjonerGroq = `* [_type=="seksjon" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${seksjonFields}, ${seksjonFields})
}`;

const faktaGroq = `* [_type=="faktum" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${faktumFields}, ${faktumFields})
}`;

const svaralternativerGroq = `* [_type=="svaralternativ" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${svaralternativFields}, ${svaralternativFields})
}`;

const landGrupperGroq = `* [_type=="landgruppe" && __i18n_lang==$baseLang]{
...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${landGruppeFields}, ${landGruppeFields})
}`;

const appTeksterGroq = `* [_type=="apptekst" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${appTekstFields}, ${appTekstFields})
  }`;

export const allTextsQuery = groq`{
  "seksjoner": ${seksjonerGroq},
  "fakta": ${faktaGroq},
  "svaralternativer": ${svaralternativerGroq},
  "landgrupper": ${landGrupperGroq},
  "apptekster": ${appTeksterGroq}
}`;
