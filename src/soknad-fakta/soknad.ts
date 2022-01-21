import { Faktumtype } from "../pages/api/types";
import { koronaFortsattRett } from "./korona-fortsatt-rett";
import { reellArbeidssoker } from "./reell-arbeidssoker";
import { arbeidsforhold } from "./arbeidsforhold";
import { eosArbeidsforhold } from "./eos-arbeidsforhold";
import { bostedsland } from "./bostedsland";
import { egenNaering } from "./egen-naering";
import { verneplikt } from "./verneplikt";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}

export type MockDataFaktum = MockDataBaseFaktum | MockDataGeneratorFaktum | MockDataValgFaktum;

export interface MockDataBaseFaktum {
  id: string;
  type: Faktumtype;
}

export interface MockDataGeneratorFaktum extends MockDataBaseFaktum {
  type: "generator";
  faktum: MockDataFaktum[];
}

export interface MockDataValgFaktum extends MockDataBaseFaktum {
  type: "boolean" | "valg" | "flervalg" | "dropdown";
  subFaktum: MockDataSubFaktum[];
  answerOptions: MockDataAnswerOption[];
}

export interface MockDataAnswerOption {
  id: string;
  documentRequiredId?: string[];
}

export type MockDataSubFaktum = MockDataFaktum & {
  requiredAnswerId: string[];
};

export interface MockDataDokumentFaktum {
  id: string;
}

const documentFakta: MockDataDokumentFaktum[] = [
  { id: "dokument-faktum.arbeidsforhold-timelister-rotasjon" },
];

export const mockSeksjoner: MockDataSeksjon[] = [
  koronaFortsattRett,
  reellArbeidssoker,
  arbeidsforhold,
  eosArbeidsforhold, // denne bør fjernes og bakes inn i arbeidsforhold?? OBS IKKE KODET FERDIG PGA AVVENT
  bostedsland,
  egenNaering,
  verneplikt,
];
