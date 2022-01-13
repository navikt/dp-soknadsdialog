export type Faktumtype =
  | "boolean" // Radio
  | "int" // number input?
  | "double" // number input?
  | "text" // Mangler i quiz. Fritekst. Bør det skilles på kort og lang tekst-input?
  | "inntekt" // number input? Skal denne til frontened? hentes fra skattetaten?
  | "localdate" // datepicker
  | "dokument" // vedlegg? Filopplaster?
  | "generator" // ?
  | "valg" // Radio
  | "flervalg"; // Checkbox

export interface QuizFaktum {
  id: string;
  beskrivendeId: string;
  type: Faktumtype;
  svaralternativer?: QuizSvaralternativ[];
  svar?: QuizSvar[];
}

export interface QuizSvaralternativ {
  id: string;
  beskrivendeId: string;
}

export type QuizSvar = QuizSvaralternativ | Date | number | string;
