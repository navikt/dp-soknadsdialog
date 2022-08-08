export interface Documents {
  id: string;
  list: DocumentItem[];
}

export interface DocumentItem {
  id: string;
  beskrivendeId: string;
  files?: string[];
}

export interface DocumentationAnswers {
  sendeInn?: string;
  hvemSender?: string;
}

export interface UploadedFile {
  urn: string;
}

export interface FileError {
  file: string;
  reason: string;
}
