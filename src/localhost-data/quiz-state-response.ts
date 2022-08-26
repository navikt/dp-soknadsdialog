import { IQuizSeksjon } from "../types/quiz.types";
import { seksjonBostedsland } from "./seksjoner/seksjonBostedsland";
import { seksjonGjenopptak } from "./seksjoner/seksjonGjenopptak";
import { seksjonArbeidsforhold } from "./seksjoner/seksjonArbeidsforhold";
import { seksjonBarnetillegg } from "./seksjoner/seksjonBarnetillegg";

export interface IQuizState {
  ferdig: boolean;
  seksjoner: IQuizSeksjon[];
  "@opprettet": string;
}

export const quizStateResponse: IQuizState = {
  ferdig: false,
  seksjoner: [seksjonBostedsland, seksjonGjenopptak, seksjonArbeidsforhold, seksjonBarnetillegg],
  "@opprettet": "2022-08-26T09:27:59.4094522144",
};
