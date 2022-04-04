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
  LandFaktumType,
  PrimitivFaktumType,
  ValgFaktumType,
} from "../types/faktum.types";
import { utdanning } from "./utdanning";

export interface BlueprintDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}

export type MockDataFaktum =
  | MockDataBaseFaktum
  | MockDataGeneratorFaktum
  | MockDataValgFaktum
  | MockDataLandFaktum;

export interface MockDataBaseFaktum {
  id: string;
  type: PrimitivFaktumType | GeneratorFaktumType | ValgFaktumType | LandFaktumType;
}

export interface MockDataGeneratorFaktum extends MockDataBaseFaktum {
  type: GeneratorFaktumType;
  faktum: MockDataFaktum[];
}

export interface MockDataValgFaktum extends MockDataBaseFaktum {
  type: ValgFaktumType;
  subFaktum?: MockDataSubFaktum[];
  answerOptions: MockDataAnswerOption[];
}

export interface MockDataLandFaktum extends MockDataBaseFaktum {
  type: LandFaktumType;
  subFaktum?: MockDataSubFaktum[];
  countryGroups: BlueprintCountryGroup[];
}

export type MockDataSubFaktum = MockDataFaktum & {
  requiredAnswerIds: string[];
};

export interface MockDataAnswerOption {
  id: string;
}

export interface BlueprintCountryGroup {
  id: string;
  countries: string[];
}

export const blueprintDataSeksjoner: BlueprintDataSeksjon[] = [
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
