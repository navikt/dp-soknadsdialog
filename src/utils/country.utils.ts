import countries, { getName } from "i18n-iso-countries";
import bokmalLocale from "i18n-iso-countries/langs/nb.json";
import nynorskLocale from "i18n-iso-countries/langs/nn.json";
import englishLocale from "i18n-iso-countries/langs/en.json";

export function getCountryName(code: string, locale: string | undefined) {
  return getName(code, setLocale(locale));
}

function setLocale(locale: string | undefined): string {
  switch (locale) {
    case "nb":
      countries.registerLocale(bokmalLocale);
      return "nb";
    case "nn":
      countries.registerLocale(nynorskLocale);
      return "nn";
    case "en":
      countries.registerLocale(englishLocale);
      return "en";

    default:
      countries.registerLocale(bokmalLocale);
      return "nb";
  }
}
