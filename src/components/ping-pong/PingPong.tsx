import React from "react";
import { TextKeyValuePair } from "../../sanity/types";
import { ApiFaktumType } from "../../pages/api/mock/mock-data";
import { IAnswer, ISubFaktum } from "../faktum/Faktum";

interface Section {
  _id: string;
  title: TextKeyValuePair;
  description?: TextKeyValuePair;
  helpText?: TextKeyValuePair;
  questions: Question[];
}

interface Question {
  _id: string;
  sectionId: string;
  type: ApiFaktumType;
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  help: TextKeyValuePair;
  alert: TextKeyValuePair;
  answers: IAnswer[];
}

interface State {
  previousSections: Section[];
  currentSection: Section;
  nextSection: Section;
}

interface ApiSection {
  id: string;
}

interface ApiQuestion {
  id: string;
  type: ApiFaktumType;
  answers: ApiAnswer[];
}

interface ApiAnswer {
  id: string;
}

export function PingPong() {
  return <div> Hei på deg ping pong component</div>;
}
