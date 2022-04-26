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

export interface BlueprintSeksjon {
  id: string;
  fakta: BlueprintFaktum[];
}

export type BlueprintFaktum =
  | BlueprintBaseFaktum
  | BlueprintGeneratorFaktum
  | BlueprintValgFaktum
  | BlueprintLandFaktum;

export interface BlueprintBaseFaktum {
  id: string;
  type: PrimitivFaktumType | GeneratorFaktumType | ValgFaktumType | LandFaktumType;
}

export interface BlueprintGeneratorFaktum extends BlueprintBaseFaktum {
  type: GeneratorFaktumType;
  fakta: BlueprintFaktum[];
}

export interface BlueprintValgFaktum extends BlueprintBaseFaktum {
  type: ValgFaktumType;
  subFakta?: BlueprintSubFaktum[];
  answerOptions: BlueprintAnswerOption[];
}

export interface BlueprintLandFaktum extends BlueprintBaseFaktum {
  type: LandFaktumType;
  subFakta?: BlueprintSubFaktum[];
  answerOptions: BlueprintCountryAnswer[];
}

export type BlueprintSubFaktum = BlueprintFaktum & {
  requiredAnswerIds: string[];
};

export interface BlueprintAnswerOption {
  id: string;
  requiredDocumentIds?: string[];
}

export interface BlueprintCountryAnswer {
  id: string;
  countries: string[];
  requiredDocumentIds?: string[];
}

export const blueprintDataSeksjoner: BlueprintSeksjon[] = [
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
