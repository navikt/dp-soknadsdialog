import { IQuizSeksjon } from "../types/quiz.types";
import { seksjonBostedsland } from "./seksjoner/seksjonBostedsland";
import { seksjonGjenopptak } from "./seksjoner/seksjonGjenopptak";
import { seksjonArbeidsforhold } from "./seksjoner/seksjonArbeidsforhold";
import { seksjonBarnetillegg } from "./seksjoner/seksjonBarnetillegg";

export interface IQuizState {
  ferdig: boolean;
  seksjoner: IQuizSeksjon[];
  roller?: string[];
}

export const quizStateResponse: IQuizState = {
  ferdig: false,
  seksjoner: [seksjonBostedsland, seksjonGjenopptak, seksjonArbeidsforhold, seksjonBarnetillegg],
  roller: [],
};
