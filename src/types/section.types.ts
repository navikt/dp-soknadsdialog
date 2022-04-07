import { IFaktum } from "./faktum.types";
import { TypedObject } from "@portabletext/types";

export interface ISection {
  id: string;
  title: string;
  description?: TypedObject | TypedObject[];
  helpText?: string;
  fakta: IFaktum[];
}
