import { QuizSeksjon } from "../../types/quiz.types";
import { gyldigeLand } from "./seksjonBostedsland";

export const seksjonBarnetillegg: QuizSeksjon = {
  fakta: [
    {
      id: "1009",
      svar: [
        [
          {
            id: "1010.1",
            svar: "MUNTER",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          },
          {
            id: "1011.1",
            svar: "AVDELING",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-etternavn",
          },
          {
            id: "1012.1",
            svar: "2012-01-04",
            type: "localdate",
            readOnly: true,
            beskrivendeId: "faktum.barn-foedselsdato",
          },
          {
            id: "1013.1",
            svar: "NOR",
            type: "land",
            grupper: [],
            readOnly: true,
            gyldigeLand,
            beskrivendeId: "faktum.barn-statsborgerskap",
          },
          {
            id: "1014.1",
            type: "boolean",
            readOnly: false,
            beskrivendeId: "faktum.barn-forsoerger-du-barnet",
            gyldigeValg: [
              "faktum.barn-forsoerger-du-barnet.svar.ja",
              "faktum.barn-forsoerger-du-barnet.svar.nei",
            ],
          },
        ],
        [
          {
            id: "1010.2",
            svar: "ETTERPÅKLOK",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          },
          {
            id: "1011.2",
            svar: "BEVILLING",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-etternavn",
          },
          {
            id: "1012.2",
            svar: "2012-12-26",
            type: "localdate",
            readOnly: true,
            beskrivendeId: "faktum.barn-foedselsdato",
          },
          {
            id: "1013.2",
            svar: "NOR",
            type: "land",
            grupper: [],
            readOnly: true,
            gyldigeLand,
            beskrivendeId: "faktum.barn-statsborgerskap",
          },
        ],
        [
          {
            id: "1010.3",
            svar: "SNILL",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          },
          {
            id: "1011.3",
            svar: "SOFA",
            type: "tekst",
            readOnly: true,
            beskrivendeId: "faktum.barn-etternavn",
          },
          {
            id: "1012.3",
            svar: "2010-09-22",
            type: "localdate",
            readOnly: true,
            beskrivendeId: "faktum.barn-foedselsdato",
          },
          {
            id: "1013.3",
            svar: "NOR",
            type: "land",
            grupper: [],
            readOnly: true,
            gyldigeLand,
            beskrivendeId: "faktum.barn-statsborgerskap",
          },
        ],
        [],
      ],
      type: "generator",
      templates: [
        {
          id: "1010",
          type: "tekst",
          beskrivendeId: "faktum.barn-fornavn-mellomnavn",
        },
        {
          id: "1011",
          type: "tekst",
          beskrivendeId: "faktum.barn-etternavn",
        },
        {
          id: "1012",
          type: "localdate",
          beskrivendeId: "faktum.barn-foedselsdato",
        },
        {
          id: "1013",
          type: "land",
          beskrivendeId: "faktum.barn-statsborgerskap",
        },
        {
          id: "1014",
          type: "boolean",
          beskrivendeId: "faktum.forsoerger-du-barnet",
        },
        {
          id: "1015",
          type: "boolean",
          beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
        },
        {
          id: "1016",
          type: "int",
          beskrivendeId: "faktum.barn-inntekt",
        },
      ],
      beskrivendeId: "faktum.register.barn-liste",
    },
  ],
  beskrivendeId: "barnetillegg-register",
  ferdig: true,
};
