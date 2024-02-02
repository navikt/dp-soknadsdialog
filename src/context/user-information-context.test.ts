import type { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";

export function FiltrerJobber(jobs: IArbeidsforhold[], maksAlderIMåneder: number): IArbeidsforhold[] {
  const nåværendeDato = new Date();
  const kappDato = new Date(nåværendeDato.getFullYear(), nåværendeDato.getMonth() - maksAlderIMåneder, nåværendeDato.getDate());
  kappDato.setHours(0, 0, 0, 0);

  const filtrerteJobber = jobs.filter(job => {
    if (!job.sluttdato) {
      return true;
    }
    const sluttDato = new Date(job.sluttdato);
    return sluttDato >= kappDato;
  });

  console.log("Filtrerte jobber:", filtrerteJobber);

  return filtrerteJobber;
}


describe('FiltrerJobber', () => {
  test('skal returnere tomt array for tom input', () => {
    const jobs:any = [];
    const resultat = FiltrerJobber(jobs, 6);
    expect(resultat).toEqual([]);
  });

  test('skal returnere samme input for jobb uten sluttdato', () => {
    const jobs = [{ id: "1", startdato: "2021-11-01", organisasjonsnavn: "Jeg jobber her AS" }];
    const resultat = FiltrerJobber(jobs, 6);
    expect(resultat).toEqual(jobs);
  });

  test('skal returnere samme input for jobb som avsluttet for 3 måneder siden', () => {
    const jobs = [{ id: "1", startdato: "2021-11-01", sluttdato: "2023-10-31", organisasjonsnavn: "Jeg jobbet her AS" }];
    const resultat = FiltrerJobber(jobs, 6);
    expect(resultat).toEqual(jobs);
  });

  test('skal returnere bare det nyeste jobbet for flere jobber', () => {
    const jobs = [
      { id: "1", startdato: "2020-01-01", sluttdato: "2021-10-31", organisasjonsnavn: "Ingen jobber her AS" },
      { id: "2", startdato: "2021-11-01", sluttdato: "2023-10-31", organisasjonsnavn: "Jeg jobbet her AS" }
    ];
    const resultat = FiltrerJobber(jobs, 6);
    expect(resultat).toEqual([jobs[1]]);
  });

  test('skal returnere bare det nyeste jobbet for flere jobber med 12 måneder', () => {
    const jobs = [
      { id: "1", startdato: "2020-01-01", sluttdato: "2021-10-31", organisasjonsnavn: "Ingen jobber her AS" },
      { id: "2", startdato: "2021-11-01", sluttdato: "2023-03-31", organisasjonsnavn: "Jeg jobbet her AS" }
    ];
    
    const resultat = FiltrerJobber(jobs, 12);
    expect(resultat).toEqual([jobs[1]]);
  });
});