import { groq } from "next-sanity";

export const fetchForside = groq`*[_type == "contentPage" && slug.current == "forside"][0]`;
export const fetchSeksjoner = groq`*[_type == "seksjon"]`;

export const fetchAllSeksjoner = groq`*[_type == "seksjon" && _id in $ids]{
  _id, title, description, helpText,
  faktum[]->{
    _id,
    type,
    title,
    type,
    unit,
    listType,
    description,
    alertText,
    helpText,
    requiredAnswerIds[]->{
      _id
    },    
    answerOptions[]->{
      _id,
      title,
      alertText,
      helpText
    },
    subFaktum[]->{
      _id,
      type,
      title,
      description,
      alertText,
      helpText,
      requiredAnswerIds[]->{
        _id
      }, 
    },
    faktum[]->{
      _id,
      type,
      title,
      type,
      unit,
      listType,
      description,
      alertText,
      helpText,
      requiredAnswerIds[]->{
        _id
      },    
      answerOptions[]->{
        _id,
        title,
        alertText,
        helpText
      },
      subFaktum[]->{
        _id,
        requiredAnswerId,
        type,
        title,
        description,
        alertText,
        helpText,
      },
  },
  }
}`;
