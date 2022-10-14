export interface IPersonalia {
  forNavn: string;
  mellomNavn: string;
  etterNavn: string;
  fødselsDato: string; // TODO: På skissene vises fødselsnummer, mens det ikke kommer med fra backenden. Er det noe som skal være med?
  postAdresse?: IAdresse;
  folkeregistrertAdresse?: IAdresse;
  kontonummer?: string;
  banknavn?: string;
  bankLandkode?: string;
  ident: string;
}

export interface IAdresse {
  adresselinje1: string;
  adresselinje2: string;
  adresselinje3: string;
  byEllerStedsnavn?: string; // TODO: Finne ut om denne skal være med, feltes ble ikke med i respons fra dev
  landkode: string;
  land: string;
  postnummer: string;
  poststed: string;
}
