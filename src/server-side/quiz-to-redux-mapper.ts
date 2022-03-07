import { RootState } from "../store";
import { Answer, AnswerType } from "../store/answers.slice";
import { QuizFaktum, QuizGeneratorFaktum } from "../types/quiz.types";
import { GeneratorState, IGeneratorAnswer } from "../store/generator-utils";

function mapPrimitiveFaktumToAnswers(faktum: QuizFaktum): Answer | null {
  if (faktum.svar === undefined) return null;

  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: faktum.type,
    answer: faktum.svar as AnswerType,
  };
}

function mapBooleanFaktumToAnswer(faktum: QuizFaktum): Answer | null {
  if (faktum.svar === undefined) return null;

  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: faktum.type,
    answer: `${faktum.beskrivendeId}.svar.${faktum.svar ? "ja" : "nei"}`,
  };
}

function mapGeneratorFaktumToGeneratorState(faktum: QuizGeneratorFaktum): GeneratorState {
  let generatorAnswers: IGeneratorAnswer[] = [];
  if (faktum.svar) {
    const quizSvar = faktum.svar;
    generatorAnswers = quizSvar.map((fakta: QuizFaktum[]) => {
      const answers: Answer[] = [];
      fakta.forEach((faktum) => {
        const answer = mapToAnswer(faktum);
        if (answer) answers.push(answer);
      });
      return { answers };
    });
  }

  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: "generator",
    answers: generatorAnswers,
  };
}

export function mapToAnswer(faktum: QuizFaktum): Answer | null {
  switch (faktum.type) {
    case "boolean":
      return mapBooleanFaktumToAnswer(faktum);

    default:
      return mapPrimitiveFaktumToAnswers(faktum);
  }
}

export function mapQuizFaktaToReduxState(
  fakta: (QuizFaktum | QuizGeneratorFaktum)[]
): Partial<RootState> {
  const answers: Answer[] = [];
  const generators: GeneratorState[] = [];

  fakta.map((faktum) => {
    let answer;
    switch (faktum.type) {
      case "generator":
        generators.push(mapGeneratorFaktumToGeneratorState(faktum));
        break;

      default:
        answer = mapToAnswer(faktum);
        if (answer) {
          answers.push(answer);
        }
        break;
    }
  });

  return {
    answers,
    generators,
  };
}
