import { QuizSeksjon } from "../types/quiz.types";
import { seksjonBostedsland } from "./seksjoner/seksjonBostedsland";
import { seksjonGjenopptak } from "./seksjoner/seksjonGjenopptak";
import { seksjonArbeidsforhold } from "./seksjoner/seksjonArbeidsforhold";
import { seksjonBarnetillegg } from "./seksjoner/seksjonBarnetillegg";

export interface QuizState {
  ferdig: boolean;
  seksjoner: QuizSeksjon[];
}

export const quizStateResponse: QuizState = {
  ferdig: false,
  seksjoner: [seksjonBostedsland, seksjonGjenopptak, seksjonArbeidsforhold, seksjonBarnetillegg],
};
