import { koronaFortsattRett } from "./korona-fortsatt-rett";
import { reellArbeidssoker } from "./reell-arbeidssoker";
import { arbeidsforhold } from "./arbeidsforhold";
import { eosArbeidsforhold } from "./eos-arbeidsforhold";
import { bostedsland } from "./bostedsland";
import { egenNaering } from "./egen-naering";
import { verneplikt } from "./verneplikt";
import { tilleggsopplysninger } from "./tilleggsopplysninger";
import { barnetillegg } from "./barnetillegg";
import { andreYtelser } from "./andre-ytelser";
import {
  GeneratorFaktumType,
  GeneratorListType,
  PrimitivFaktumType,
  ValgFaktumType,
} from "../types/faktum.types";
import { utdanning } from "./utdanning";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}

export type MockDataFaktum = MockDataBaseFaktum | MockDataGeneratorFaktum | MockDataValgFaktum;

export interface MockDataBaseFaktum {
  id: string;
  type: PrimitivFaktumType | GeneratorFaktumType | ValgFaktumType;
}

export interface MockDataGeneratorFaktum extends MockDataBaseFaktum {
  type: GeneratorFaktumType;
  listType: GeneratorListType;
  faktum: MockDataFaktum[];
}

export interface MockDataValgFaktum extends MockDataBaseFaktum {
  type: ValgFaktumType;
  subFaktum?: MockDataSubFaktum[];
  answerOptions: MockDataAnswerOption[];
}

export interface MockDataAnswerOption {
  id: string;
}

export type MockDataSubFaktum = MockDataFaktum & {
  requiredAnswerIds: string[];
};

export const mockSeksjoner: MockDataSeksjon[] = [
  koronaFortsattRett,
  reellArbeidssoker,
  arbeidsforhold,
  eosArbeidsforhold, // denne bør fjernes og bakes inn i arbeidsforhold?? OBS IKKE KODET FERDIG PGA AVVENT
  bostedsland,
  egenNaering,
  verneplikt,
  andreYtelser,
  // personalia mangler her, men burde kanskje ikke være i en svarseksjon siden man ikke kan endre noe av informasjonen?
  barnetillegg,
  utdanning,
  tilleggsopplysninger,
];
