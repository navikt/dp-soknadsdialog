import { IFaktum } from "./faktum.types";
import { TypedObject } from "@portabletext/types";

export interface ISeksjon {
  id: string;
  title: string;
  description?: TypedObject | TypedObject[];
  helpText?: string;
  faktum: IFaktum[];
}
