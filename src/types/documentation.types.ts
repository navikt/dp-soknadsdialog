export interface Documents {
  id: string;
  list: DocumentListItem[];
}

export interface DocumentListItem {
  id: string;
  beskrivendeId: string;
  files?: string[];
}

export interface UploadedFile {
  urn: string;
  filnavn: string;
}

export interface FileState {
  id: string;
  name?: string;
  state?: "UPLOADING" | "UPLOADED" | "ERROR";
  file?: File;
  error?: "FILE_FORMAT" | "FILE_SIZE" | "SERVER_ERROR";
  urn?: string;
}

export interface FileError {
  file: string;
  reason: string;
}
