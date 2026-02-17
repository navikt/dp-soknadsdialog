import { subDays } from "date-fns";
import { IInnsentSoknad, IOrkestratorSoknad, IPaabegyntSoknad } from "../../types/quiz.types";
import { ICombinedInnsendtSoknad } from "./Inngang";

export function mapOrkestratorInnsendteSoknader(
  orkestratorSoknader: IOrkestratorSoknad[] | null | undefined,
): ICombinedInnsendtSoknad[] {
  const within30Days = subDays(Date.now(), 30);

  return (
    orkestratorSoknader
      ?.filter((soknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT")
      .filter(
        (soknad) =>
          soknad.innsendtTimestamp !== undefined &&
          new Date(soknad.innsendtTimestamp) > within30Days,
      )
      .map((soknad) => ({
        soknadUuid: soknad.søknadId,
        forstInnsendt: soknad.innsendtTimestamp!,
        isOrkestratorSoknad: true,
      })) || []
  );
}

export function mapQuizInnsendteSoknader(
  innsendte: IInnsentSoknad[] | undefined,
): ICombinedInnsendtSoknad[] {
  return (
    innsendte?.map((soknad) => ({
      ...soknad,
      isOrkestratorSoknad: false,
    })) || []
  );
}

export function combineAndSortInnsendteSoknader(
  orkestratorInnsendte: ICombinedInnsendtSoknad[],
  quizInnsendte: ICombinedInnsendtSoknad[],
): ICombinedInnsendtSoknad[] {
  return [...orkestratorInnsendte, ...quizInnsendte].sort(
    (a, b) => new Date(b.forstInnsendt).getTime() - new Date(a.forstInnsendt).getTime(),
  );
}

export function mapOrkestratorPaabegyntSoknader(
  orkestratorSoknader: IOrkestratorSoknad[] | null | undefined,
): IPaabegyntSoknad[] {
  return (
    orkestratorSoknader
      ?.filter((soknad) => soknad.status === "PÅBEGYNT" && soknad.oppdatertTidspunkt !== undefined)
      .map((soknad) => ({
        soknadUuid: soknad.søknadId,
        opprettet: soknad.oppdatertTidspunkt!,
        sistEndretAvbruker: soknad.oppdatertTidspunkt!,
      })) || []
  );
}
