export type Faktumtype =
  | "boolean" // Type: radio input, Payload: true/false, Trenger vi denne? Kan ikke alle radio være valg (som under)?
  | "valg" // Type: radio input, Payload: id til valget
  | "dropdown" // Type: dropdown, Payload: id til valget
  | "int" // Type: number input, Payload: 1
  | "double" // Type: number input, Payload: 1.0
  | "localdate" // Type: datepicker, Payload: ISO8601(LocalDateTime)
  | "periode" // Type: datepicker, Payload: {"fom": "ISO8601(LocalDateTime)", "tom": "ISO8601(LocalDateTime)"},
  | "dokument" // Type: filopplaster?, Payload: { "urn": "path til fil", "opplastningsTidspunkt": "ISO8601(LocalDateTime)"}
  | "flervalg" // Type: checkbox input, Payload: [teksten til valgene, eller id til valgene?]
  | "tekst" // Type: tekst input?, Payload: "fritekst"
  | "numberOptional" // Type: number input og checkbox under
  | "generator"; // ?

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
