import { IGeneratorAnswer } from "../store/generator-utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export function useGeneratorStateAnswers(id: string): IGeneratorAnswer[] {
  return useSelector(
    (state: RootState) =>
      state.generators.find((generator) => generator.beskrivendeId === id)?.answers || []
  );
}
