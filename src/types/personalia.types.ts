export interface Personalia {
  forNavn: string;
  mellomNavn: string;
  etterNavn: string;
  fødselsDato: Date;
  postAdresse?: Adresse;
  folkeregistrertAdresse?: Adresse;
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

export interface Kontonummer {
  kontonummer: string;
  banknavn?: string;
  landkode?: string;
}
