import { Faktumtype } from "../pages/api/types";

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

export interface SanitySeksjon {
  _id: string;
  _type: "seksjon";
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  faktum: SanityRef<SanityFaktum>[];
}

export interface SanityFaktum {
  _id: string;
  _type: "faktum";
  type: Faktumtype;
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  helpText: TextKeyValuePair;
  alertText: TextKeyValuePair | ConditionalTextKeyValuePair; // mulig denne trenger conditions. Eks vises hvis du skriver mindre enn x timer i et felt
  answers: SanityRef<SanityAnswer>[];
  subFaktum: SanityRef<SanitySubFaktum>[];
}

export interface SanitySubFaktum extends Omit<SanityFaktum, "subFaktum" | "_type"> {
  _type: "subFaktum";
  requiredAnswerId: string;
}

export interface SanityAnswer {
  _id: string;
  _type: "answer";
  text: TextKeyValuePair;
  alertText: TextKeyValuePair;
}

export interface TextKeyValuePair {
  key: string;
  value?: string;
}

export interface ConditionalTextKeyValuePair extends TextKeyValuePair {
  regex: string;
}

// T only used to identify ref type when reading code
export interface SanityRef<T = unknown> {
  _type: "reference";
  _ref: string;
  _key?: string;
}
