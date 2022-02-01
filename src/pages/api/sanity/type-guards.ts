import { SubFaktum } from "../../../sanity/utils";
import { MockDataFaktum, MockDataValgFaktum, MockDataGeneratorFaktum } from "../../../soknad-fakta/soknad";

export function isValgFaktum(faktum: MockDataFaktum): faktum is MockDataValgFaktum {
  return (faktum as MockDataValgFaktum).answerOptions !== undefined;
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(faktum: MockDataFaktum): faktum is MockDataGeneratorFaktum {
  return (faktum as MockDataGeneratorFaktum).faktum !== undefined;
}
