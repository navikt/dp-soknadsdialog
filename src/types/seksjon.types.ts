import { IFaktum } from "./faktum.types";

export interface ISeksjon {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  faktum: IFaktum[];
}
