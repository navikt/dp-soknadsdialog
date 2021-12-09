import { ApiFaktumType } from "../pages/api/mock/mock-data";

export interface SanityBase {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityLandingPage {
  title: string;
  content: string;
}

export interface Seksjon {
  _id: string;
  _type: "seksjon";
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  helpText: TextKeyValuePair;
  faktum: SanityRef<Faktum>[];
}

export interface Faktum {
  _id: string;
  _type: "faktum";
  type: ApiFaktumType;
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  helpText: TextKeyValuePair;
  alertText: TextKeyValuePair;
  answers: SanityRef<Answer>[];
  subFaktum: SanityRef<SubFaktum>[];
}

export interface SubFaktum extends Omit<Faktum, "subFaktum" | "_type"> {
  _type: "subFaktum";
  requiredAnswerId: string;
}

export interface Answer {
  _id: string;
  _type: "answer";
  text: TextKeyValuePair;
  alertText: TextKeyValuePair;
}

export interface TextKeyValuePair {
  key: string;
  value?: string;
}

// T only used to identify ref type when reading code
export interface SanityRef<T = unknown> {
  _type: "reference";
  _ref: string;
  _key?: string;
}
