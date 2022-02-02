export type Person = {
  forNavn: string;
  mellomNavn: string;
  etterNavn: string;
  fødselsDato: Date;
  postAdresse?: Adresse;
  folkeregistrertAdresse?: Adresse;
};

export type Adresse = {
  adresselinje1: string;
  adresselinje2: string;
  adresselinje3: string;
  byEllerStedsnavn: string;
  landkode: string;
  land: string;
  postkode: string;
};

export type Kontonummer = {
  kontonummer: string;
  banknavn?: string;
  landkode?: string;
};

// As of https://tools.ietf.org/html/rfc7807
export type HttpProblem = {
  type: URL;
  title: string;
  status?: number;
  detail?: string;
  instance?: URL;
};
