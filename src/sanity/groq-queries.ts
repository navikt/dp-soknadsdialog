import { groq } from "next-sanity";

const faktumGroq = `
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
  }
`;

export const fetchAllSeksjoner = groq`*[_type == "seksjon"]{
  'id': _id, title, description, helpText,
  faktum[]->{
    ${faktumGroq},
    subFaktum[]->{
      ${faktumGroq}
    },
    faktum[]->{
      ${faktumGroq},
      subFaktum[]->{
        ${faktumGroq}
      },
    }
  }
}`;
