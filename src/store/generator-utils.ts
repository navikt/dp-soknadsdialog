import { PayloadAction } from "@reduxjs/toolkit";
import { Answer, AnswerType } from "./answers.slice";
import { QuizFaktum, QuizGeneratorFaktum } from "../types/quiz.types";
import api from "../api.utils";

export interface GeneratorFaktumPayload {
  answers: Answer[];
  index: number;
}

export interface IGeneratorAnswer {
  answers: Answer[];
}

export interface GeneratorState {
  id: string;
  beskrivendeId: string;
  type: "generator";
  answers: IGeneratorAnswer[];
}

export interface QuizAnswer {
  id: string;
  beskrivendeId: string;
  type: string;
  svar: AnswerType;
}

export function saveGeneratorFaktumReducer(
  state: GeneratorState,
  action: PayloadAction<GeneratorFaktumPayload>
): GeneratorState {
  if (state.answers[action.payload.index]?.answers) {
    state.answers[action.payload.index].answers = action.payload.answers;
  } else {
    state.answers.push({ answers: action.payload.answers });
  }
  return state;
}

export function mapReduxAnswerToQuizAnswer(
  answer: Answer,
  quizFaktum: QuizGeneratorFaktum
): QuizAnswer {
  const quizId = quizFaktum.templates.find((template) => {
    return template.beskrivendeId === answer.beskrivendeId;
  })?.id;

  if (!quizId) {
    // TODO sentry
    // eslint-disable-next-line no-console
    console.error(
      `Fant ikke quiz ID for ${answer.beskrivendeId}, kan ikke lagre faktum i generator`
    );
  }

  return {
    id: quizId || answer.id,
    beskrivendeId: answer.beskrivendeId,
    type: answer.type,
    svar: answer.answer,
  };
}

export async function saveGeneratorStateToQuiz(
  soknadId: string,
  quizFakta: QuizFaktum[],
  generatorState: GeneratorState,
  generatorStateBeskrivendeId: string,
  generatorFaktumPayload: GeneratorFaktumPayload
): Promise<GeneratorFaktumPayload> {
  const quizFaktum = quizFakta.find(
    (faktum) => faktum.beskrivendeId === generatorStateBeskrivendeId
  ) as QuizGeneratorFaktum | undefined;

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject(
      `Fant ikke faktum ${generatorStateBeskrivendeId} i quizFaktum i redux state.`
    );
  }

  const answersInQuizFormat: QuizAnswer[][] = generatorState.answers.map((answer) =>
    answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
  );

  answersInQuizFormat[generatorFaktumPayload.index] = generatorFaktumPayload.answers.map((answer) =>
    mapReduxAnswerToQuizAnswer(answer, quizFaktum)
  );

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: generatorStateBeskrivendeId,
      type: "generator",
      svar: answersInQuizFormat,
    }),
  });

  if (response.ok) {
    return Promise.resolve(generatorFaktumPayload);
  }

  // TODO Sentry
  return Promise.reject(
    `Klarte ikke å lagre generator state for ${generatorStateBeskrivendeId} i quiz`
  );
}

export async function deleteGeneratorStateFromQuiz(
  soknadId: string,
  quizFakta: QuizFaktum[],
  generatorState: GeneratorState,
  generatorStateBeskrivendeId: string,
  deleteIndex: number
): Promise<number> {
  const quizFaktum = quizFakta.find(
    (faktum) => faktum.beskrivendeId === generatorStateBeskrivendeId
  ) as QuizGeneratorFaktum | undefined;

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject("Ney");
  }

  const answersInQuizFormat: QuizAnswer[][] = generatorState.answers.map((answer) =>
    answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
  );
  answersInQuizFormat.splice(deleteIndex, 1);

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: generatorStateBeskrivendeId,
      type: "generator",
      svar: answersInQuizFormat,
    }),
  });

  if (response.ok) {
    return Promise.resolve(deleteIndex);
  }

  // TODO Sentry
  return Promise.reject();
}
