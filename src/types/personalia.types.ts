export interface IPersonalia {
  forNavn: string;
  mellomNavn: string;
  etterNavn: string;
  fødselsDato: string;
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
  byEllerStedsnavn?: string;
  landkode: string;
  land: string;
  postnummer: string;
  poststed: string;
}
