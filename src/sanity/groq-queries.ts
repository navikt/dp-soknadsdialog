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
      text,
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
        text,
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

export const answerOption = `{
_id,
text,
alertText,
helpText
}`;

export const answerId = `{
_id
}`;
