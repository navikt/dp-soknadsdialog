import { groq } from "next-sanity";

export const fetchForside = groq`*[_type == "contentPage" && slug.current == "forside"][0]`;

export const fetchAllSeksjoner = groq`*[_type == "seksjon"]{
  'id': _id, title, description, helpText,
  faktum[]->{
    'id': _id,
    type,
    title,
    type,
    unit,
    listType,
    description,
    alertText,
    helpText,
    requiredAnswerIds[]->{
      'id': _id
    },    
    answerOptions[]->{
      'id': _id,
      title,
      alertText,
      helpText
    },
    subFaktum[]->{
      'id': _id,
      type,
      title,
      description,
      alertText,
      helpText,
      requiredAnswerIds[]->{
        'id': _id
      },
      answerOptions[]->{
        'id': _id,
        title,
        alertText,
        helpText
      },
    },
    faktum[]->{
      'id': _id,
      type,
      title,
      type,
      unit,
      listType,
      description,
      alertText,
      helpText,
      requiredAnswerIds[]->{
        'id': _id
      },    
      answerOptions[]->{
        'id': _id,
        title,
        alertText,
        helpText
      },
      subFaktum[]->{
        'id': _id,
        requiredAnswerIds[]->{
          'id': _id
        },
        answerOptions[]->{
          'id': _id,
          title,
          alertText,
          helpText
        },
        type,
        title,
        description,
        alertText,
        helpText,
      },
  },
  }
}`;
