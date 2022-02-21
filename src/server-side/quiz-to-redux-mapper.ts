import { QuizFaktum, QuizGeneratorFaktum } from "../soknad-fakta/mock-fakta-response";
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
  let generatorState;
  let arbeidsforhold;
  let barnetillegg;

  fakta.map((faktum) => {
    let answer;
    switch (faktum.type) {
      case "generator":
        generatorState = mapGeneratorFaktumToGeneratorState(faktum);
        switch (generatorState.beskrivendeId) {
          case "faktum.arbeidsforhold":
            arbeidsforhold = generatorState;
            break;

          case "faktum.barn-liste":
            barnetillegg = generatorState;
            break;
        }

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
    ...(arbeidsforhold ? { arbeidsforhold } : {}),
    ...(barnetillegg ? { barnetillegg } : {}),
  };
}
