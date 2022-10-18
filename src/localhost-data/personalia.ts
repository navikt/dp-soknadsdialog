import { IPersonalia } from "../types/personalia.types";

export const mockPersonalia: IPersonalia = {
  folkeregistrertAdresse: {
    adresselinje1: "Brekkerødlia 41",
    adresselinje2: "",
    adresselinje3: "",
    postnummer: "1782",
    poststed: "Halden",
    landkode: "NO",
    land: "NORGE",
  },
  forNavn: "STORARTET",
  mellomNavn: "",
  etterNavn: "SOLSIKKE",
  fødselsDato: "1980-03-29",
  postAdresse: {
    adresselinje1: "Brekkerødlia 41",
    adresselinje2: "",
    adresselinje3: "",
    postnummer: "1782",
    poststed: "Halden",
    landkode: "NO",
    land: "NORGE",
  },
  ident: "29838099503",
  bankLandkode: "NO",
  banknavn: "Bank i utlandet",
  kontonummer: "12341212345",
};

export const mockPersonaliaStrentFortrolig: IPersonalia = {
  forNavn: "MEMORERENDE",
  mellomNavn: "",
  etterNavn: "PRODUKSJON",
  fødselsDato: "1928-01-15",
  kontonummer: "00825323708",
  ident: "15812849066",
};
