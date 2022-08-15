import { IQuizSeksjon } from "../../types/quiz.types";
import { gyldigeLand } from "./seksjonBostedsland";

export const seksjonBarnetillegg: IQuizSeksjon = {
  beskrivendeId: "barnetillegg",
  fakta: [
    {
      beskrivendeId: "faktum.legge-til-egne-barn",
      gyldigeValg: ["faktum.legge-til-egne-barn.svar.ja", "faktum.legge-til-egne-barn.svar.nei"],
      id: "1007",
      readOnly: false,
      svar: true,
      type: "boolean",
    },
    {
      beskrivendeId: "faktum.barn-liste",
      id: "1001",
      readOnly: false,
      svar: [
        [
          {
            id: "1002.1",
            svar: "SIV",
            type: "tekst",
            readOnly: false,
            beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          },
        ],
      ],
      templates: [
        {
          beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          id: "1002",
          type: "tekst",
        },
        {
          beskrivendeId: "faktum.barn-etternavn",
          id: "1003",
          type: "tekst",
        },
        {
          beskrivendeId: "faktum.barn-foedselsdato",
          id: "1004",
          type: "localdate",
        },
        {
          beskrivendeId: "faktum.barn-statsborgerskap",
          id: "1005",
          type: "land",
        },
        {
          beskrivendeId: "faktum.forsoerger-du-barnet",
          id: "1006",
          type: "boolean",
        },
        {
          beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
          id: "1007",
          type: "boolean",
        },
        {
          beskrivendeId: "faktum.barn-inntekt",
          id: "1008",
          type: "int",
        },
      ],
      type: "generator",
    },
    {
      beskrivendeId: "faktum.register.barn-liste",
      id: "1008",
      readOnly: true,
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
      templates: [
        {
          beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          id: "1010",
          type: "tekst",
        },
        {
          beskrivendeId: "faktum.barn-etternavn",
          id: "1011",
          type: "tekst",
        },
        {
          beskrivendeId: "faktum.barn-foedselsdato",
          id: "1012",
          type: "localdate",
        },
        {
          beskrivendeId: "faktum.barn-statsborgerskap",
          id: "1013",
          type: "land",
        },
        {
          beskrivendeId: "faktum.forsoerger-du-barnet",
          id: "1014",
          type: "boolean",
        },
        {
          beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
          id: "1015",
          type: "boolean",
        },
        {
          beskrivendeId: "faktum.barn-inntekt",
          id: "1016",
          type: "int",
        },
      ],
      type: "generator",
    },
  ],
  ferdig: false,
};
