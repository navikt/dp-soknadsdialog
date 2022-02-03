export interface Personalia {
  forNavn: string;
  mellomNavn: string;
  etterNavn: string;
  fødselsDato: Date;
  postAdresse?: Adresse;
  folkeregistrertAdresse?: Adresse;
  kontonummer: string;
  banknavn?: string;
  bankLandkode?: string;
}

export interface Adresse {
  adresselinje1: string;
  adresselinje2: string;
  adresselinje3: string;
  byEllerStedsnavn: string;
  landkode: string;
  land: string;
  postkode: string;
}
