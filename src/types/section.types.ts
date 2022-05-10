import { IDescription, IFaktum } from "./faktum.types";
import { SanityHelpText } from "../pages/[uuid]";

export interface ISection {
  id: string;
  title: string;
  description?: IDescription;
  helpText?: SanityHelpText;
  fakta: IFaktum[];
}
