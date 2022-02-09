import { MockDataSeksjon } from "./soknad";

export const bostedsland: MockDataSeksjon = {
  id: "bostedsland",
  faktum: [
    {
      id: "faktum.hvilket-land-bor-du-i",
      type: "land",
      answerOptions: [], //todo:fyll ut all verdens land fra en eller annen fil
    },
  ],
};
