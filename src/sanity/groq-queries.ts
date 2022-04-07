import { groq } from "next-sanity";

const faktumGroq = `
  'textId': _id,
  type,
  title,
  type,
  unit,
  description,
  alertText,
  helpText,
  'requiredAnswerIds': requiredAnswerIds[]-> _id,
  answerOptions[]->{
    'textId': _id,
    title,
    alertText,
    helpText
  }
`;

export const fetchAllSeksjoner = groq`*[_type == "seksjon" && !(_id in path("drafts.**"))]{
  'id': _id, title, description, helpText,
  'fakta': faktum[]->{
    ${faktumGroq},
    'subFakta': subFaktum[]->{
      ${faktumGroq},
      'fakta': faktum[]->{
        ${faktumGroq}
      },
    },
    'fakta': faktum[]->{
      ${faktumGroq},
      'subFakta': subFaktum[]->{
        ${faktumGroq},
        'fakta': faktum[]->{
          ${faktumGroq}
        }
      },
    }
  }
}`;
