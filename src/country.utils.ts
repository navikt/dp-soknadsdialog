import countries, { getName } from "i18n-iso-countries";
import norwegianLocale from "i18n-iso-countries/langs/nb.json";
import { DropdownOption } from "./components/input/dropdown/Dropdown";

countries.registerLocale(norwegianLocale);
const alpha3CountryCodesObject = countries.getAlpha3Codes();

export const allCountryCodes = Object.keys(alpha3CountryCodesObject).map(
  (alpha3code) => alpha3code
);

const EOSAndSwitzerland = [
  "BEL",
  "BGR",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "GRC",
  "IRL",
  "ISL",
  "ITA",
  "HRV",
  "CYP",
  "LVA",
  "LIE",
  "LTU",
  "LUX",
  "MLT",
  "NLD",
  "NOR",
  "POL",
  "PRT",
  "ROU",
  "SVK",
  "SVN",
  "ESP",
  "CHE",
  "SWE",
  "CZE",
  "DEU",
  "HUN",
  "AUT",
];
const norwayAndJanMayen = ["NOR", "SJM"];
const greatBritain = ["GBR", "JEY", "IMN"]; // Part of brexit

const EOSWithoutNorwayAndJanMayen = EOSAndSwitzerland.filter(
  (code) => !norwayAndJanMayen.includes(code)
);
const outsideEOS = allCountryCodes
  .filter((code) => !EOSAndSwitzerland.includes(code))
  .filter((code) => !norwayAndJanMayen.includes(code))
  .filter((code) => !greatBritain.includes(code));

export enum CountryGroup {
  EOS_SVEITS = "land.eos-eller-sveits",
  NORGE_JANMAYEN = "land.norge-svalbard-janmayen",
  STORBRITTANIA = "land.storbritannia",
  UTENFOR_EOS = "land.utenfor-eos",
}

export function getListOfCountryCodes(countryGroupId?: string) {
  switch (countryGroupId) {
    case CountryGroup.EOS_SVEITS:
      return EOSWithoutNorwayAndJanMayen;
    case CountryGroup.NORGE_JANMAYEN:
      return norwayAndJanMayen;
    case CountryGroup.STORBRITTANIA:
      return greatBritain;
    case CountryGroup.UTENFOR_EOS:
      return outsideEOS;
    default:
      return allCountryCodes;
  }
}

export function getCountryDropdownOptionsForFaktum(faktumId: string): DropdownOption[] {
  const toDropDownOption = (code: string) => ({
    value: code,
    label: getName(code, "nb"),
  });
  switch (faktumId) {
    case "faktum.dagpenger-hvilket-eos-land-utbetaler":
      return allCountryCodes.map(toDropDownOption);
    default:
      return allCountryCodes.map(toDropDownOption);
  }
}
