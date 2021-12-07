import { groq } from "next-sanity";

export const fetchForside = groq`*[_type == "contentPage" && slug.current == "forside"][0]`;
export const fetchSeksjoner = groq`*[_type == "seksjon"]`;
export const fetchSeksjonById = groq`*[_id == $id]{
  _id, title, description, helpText,
  faktum[]->{
    _id,
    type,
    title,
    description,
    alertText,
    helpText,
    answers[]->{
      _id,
      text,
      alertText
    },
    subFaktum[]->{
    _id,
    requiredAnswerId,
    type,
    title,
    description,
    alertText,
    helpText,
    answers[]->{
      _id,
      text,
      alertText
    }
  }
}
}[0]`;
