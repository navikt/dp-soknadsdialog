import { HelpText, IDescription, IFaktum } from "./faktum.types";

export interface ISection {
  id: string;
  title: string;
  description?: IDescription;
  helpText?: HelpText;
  fakta: IFaktum[];
}
