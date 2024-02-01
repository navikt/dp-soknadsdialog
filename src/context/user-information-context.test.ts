import type { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";


export function FiltrerJobber(jobs: IArbeidsforhold[], maksAlderIMåneder: number): IArbeidsforhold[] {
  const nåværendeDato = new Date();
  const kappDato = new Date(nåværendeDato.getFullYear(), nåværendeDato.getMonth() - maksAlderIMåneder, nåværendeDato.getDate());

  const filtrerteJobber = jobs.filter(job => {
    const startDato = new Date(job.startdato);
    return startDato <= kappDato;
  });

  console.log("Filtrerte jobber:", filtrerteJobber);

  return filtrerteJobber;
}


test('skal filtrere ut jobber yngre enn 12 måneder', () => {
  const jobber = [
    {id:"1","startdato": "2019-01-01", "sluttdato": "2021-10-31", "organisasjonsnavn": "Ikke fest AS"},
    {id:"2","startdato": "2021-11-01", "sluttdato": "2023-12-31", "organisasjonsnavn": "Fest AS"}
  ];

  const filtrerteJobber = FiltrerJobber(jobber, 12);
  expect(filtrerteJobber.length).toBe(1);
  expect(filtrerteJobber[0]).toStrictEqual({id:"2","startdato": "2021-11-01", "sluttdato": "2023-12-31", "organisasjonsnavn": "Fest AS"});
});
