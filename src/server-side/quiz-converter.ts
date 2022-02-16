import { QuizFaktum } from "../soknad-fakta/mock-fakta-response";
import { RootState } from "../store";
import { Answer, AnswerType } from "../store/answers.slice";
import { GeneratorState, IGeneratorAnswer } from "../store/arbeidsforhold.slice";

function mapPrimitiveFaktumToAnswers(faktum: QuizFaktum): Answer | null {
  if (faktum.svar === undefined) return null;

  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: faktum.type,
    answer: faktum.svar as AnswerType,
  };
}

function mapBooleanFaktumToAnswer(faktum: QuizFaktum): Answer {
  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: faktum.type,
    answer: `${faktum.beskrivendeId}.svar.${faktum.svar ? "ja" : "nei"}`,
  };
}

function mapGeneratorFaktumToGeneratorState(faktum: QuizFaktum): GeneratorState {
  let answers: IGeneratorAnswer[] = [];
  if (faktum.svar) {
    const quizSvar = faktum.svar as QuizFaktum[][];
    answers = quizSvar.map((fakta: QuizFaktum[]) => mapQuizFaktaToReduxState(fakta));
  }

  return {
    id: faktum.id,
    beskrivendeId: faktum.beskrivendeId,
    type: "generator",
    answers,
  };
}

export function mapQuizFaktaToReduxState(fakta: QuizFaktum[]): Partial<RootState> {
  const answers: Answer[] = [];
  let generatorState;
  let arbeidsforhold: GeneratorState;
  let barnetillegg: GeneratorState;

  fakta.map((faktum: QuizFaktum) => {
    let answer;
    switch (faktum.type) {
      case "boolean":
        answers.push(mapBooleanFaktumToAnswer(faktum));
        break;

      case "generator":
        generatorState = mapGeneratorFaktumToGeneratorState(faktum);

        switch (generatorState.beskrivendeId) {
          case "arbeidsforhold":
            arbeidsforhold = generatorState;
            break;

          case "barnetillegg":
            barnetillegg = generatorState;
            break;
        }
        break;

      default:
        answer = mapPrimitiveFaktumToAnswers(faktum);
        if (answer) {
          answers.push(answer);
        }
        break;
    }
  });

  return {
    answers,
    ...(arbeidsforhold ? { arbeidsforhold } : {}),
    ...(barnetillegg ? { barnetillegg } : {}),
  };
}
