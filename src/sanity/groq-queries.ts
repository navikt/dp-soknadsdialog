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

const appTextsGroq = `* [_type=="apptekst" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${appTextsFields}, ${appTextsFields})
  }`;

const infosiderGroq = `* [_type=="infopage"  && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${infosideFields}, ${infosideFields})
  }`;

const dokumentkravGroq = `* [_type=="dokumentkrav" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${dokumentkravFields}, ${dokumentkravFields})
  }`;

const dokumentkravSvarGroq = `* [_type=="dokumentkravSvar" && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${dokumentkravFields}, ${dokumentkravSvarFields})
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
