import { TypedObject } from "@portabletext/types";

export interface ISanityHelpText {
  title?: string;
  body: TypedObject | TypedObject[];
}

export interface ISanityAlertText {
  title?: string;
  type: "info" | "warning" | "error" | "success";
  body: TypedObject | TypedObject[];
  active: boolean | undefined;
}

export interface ISanityFaktum {
  textId: string;
  text: string;
  description?: TypedObject | TypedObject[];
  helpText?: ISanityHelpText;
  unit?: string;
}

export interface ISanitySeksjon {
  textId: string;
  title: string;
  description?: TypedObject | TypedObject[];
  helpText?: ISanityHelpText;
}

export interface ISanitySvaralternativ {
  textId: string;
  text: string;
  alertText?: ISanityAlertText;
}

export interface ISanityLandGruppe {
  textId: string;
  alertText?: ISanityAlertText;
}

export interface ISanityAppTekst {
  textId: string;
  valueText: string;
}

export interface ISanityStartSideTekst {
  body: TypedObject | TypedObject[];
}

export interface ISanityTexts {
  fakta: ISanityFaktum[];
  seksjoner: ISanitySeksjon[];
  svaralternativer: ISanitySvaralternativ[];
  landgrupper: ISanityLandGruppe[];
  apptekster: ISanityAppTekst[];
  startside: ISanityStartSideTekst[];
}
