import { ISoknadStatus } from "../types/quiz.types";

export function erSoknadInnsendt(status: ISoknadStatus) {
  return !!status.innsendt;
}
