import { IPersonalia } from "./types/personalia.types";

export function getAge(date: string) {
  // Using a year of 365.25 days (because leap years)
  const yearInMs = 3.15576e10;
  const birthDate = new Date(date);
  /* This is a pretty accurate calculation, but not without its fault.
     The problem? Leap years, time zones, winter/summer time ++.
     It can be off 10-20 hours depending on the date. */
  return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / yearInMs);
}

export function joinStrings(values: (string | undefined)[], separator: string) {
  return values
    .filter((item) => {
      return item !== "" && item !== undefined;
    })
    .join(separator);
}

export function getFormattedPersonalia(personalia: IPersonalia) {
  const { forNavn, mellomNavn, etterNavn, folkeregistrertAdresse: adresse } = personalia;

  const navn = joinStrings([forNavn, mellomNavn, etterNavn], " ");
  const adresselinjer = joinStrings(
    [adresse?.adresselinje1, adresse?.adresselinje2, adresse?.adresselinje3],
    ", "
  );
  const postadresse = joinStrings([adresse?.postnummer, adresse?.poststed], ", ");

  return {
    navn,
    adresselinjer,
    postadresse,
  };
}
