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
import { utdanning } from "./utdanning";

export const blueprintDataSeksjoner = [
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
