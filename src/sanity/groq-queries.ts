import { groq } from "next-sanity";

const faktumGroq = `
  'beskrivendeId': _id,
  type,
  title,
  type,
  unit,
  listType,
  description,
  alertText,
  helpText,
  requiredAnswerIds[]->{
    'beskrivendeId': _id
  },
  answerOptions[]->{
    'beskrivendeId': _id,
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
