import { groq } from "next-sanity";

const seksjonerGroq = `* [_type == "seksjon"]{
  textId,
  title,
  description,
  helpText
}`;

const faktaGroq = `* [_type == "faktum"]{
  textId,
  text,
  description,
  helpText,
  unit
}`;

const svaralternativerGroq = `* [_type == "svaralternativ"]{
  textId,
  text,
  alertText
}`;

export const allTexts = groq`{
  "seksjoner": ${seksjonerGroq},
  "fakta": ${faktaGroq},
  "svaralternativer": ${svaralternativerGroq},
}`;
