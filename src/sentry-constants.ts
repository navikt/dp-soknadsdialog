export type FetchErrorType =
  | typeof GET_PERSONALIA_ERROR
  | typeof GET_SOKNAD_STATE_ERROR
  | typeof GET_DOKUMENTKRAV_ERROR
  | typeof GET_ARBEIDSSOKER_STATUS_ERROR
  | typeof GET_MINE_SOKNADER_ERROR
  | typeof CREATE_INNSENDING_UUID_ERROR
  | typeof DELETE_SOKNAD_ERROR
  | typeof GET_MELLOMLARING_DOKUMENT_ERROR
  | typeof BUNBLE_FILES_IN_DP_MELLOMLAGRING_ERROR
  | typeof PUT_ETTERSENDING_ERROR
  | typeof PUT_FERDIGSTILL_ERROR
  | typeof DELETE_FILE_FROM_DP_SOKNAD_ERROR
  | typeof BUNBLE_DOCKUMENTKRAV_ERROR
  | typeof DELETE_FILE_FROM_DP_MELLOMLAGRING_ERROR
  | typeof SAVE_FILE_FROM_TO_DP_SOKNAD_ERROR
  | typeof SAVE_FILE_FROM_TO_DP_MELLOMLAGRING_ERROR
  | typeof SEND_BUNBLE_TO_DP_SOKNAD_ERROR;

// Personalia
export const GET_PERSONALIA_ERROR = "Feil ved henting av personalia";

// Arbeidssøker
export const GET_ARBEIDSSOKER_STATUS_ERROR = "Feil ved henting av arbeidssøker status";

// Mine søknader
export const GET_MINE_SOKNADER_ERROR = "Feil ved henting av mine søknader";

// Søknad
export const GET_SOKNAD_STATE_ERROR = "Feil ved henting av søknadsstate fra dp-soknad";
export const DELETE_SOKNAD_ERROR = "Feil ved sletting av søknaden";

// Dokumentasjonskrav
export const GET_DOKUMENTKRAV_ERROR = "Feil ved henting av dokumentskrav";
export const GET_MELLOMLARING_DOKUMENT_ERROR = "Feil ved henting av fil fra mellomlagring";
export const BUNBLE_FILES_IN_DP_MELLOMLAGRING_ERROR = "Feil ved bundling i dp-mellomlagring";
export const BUNBLE_DOCKUMENTKRAV_ERROR = "Feil ved bundling av dokumentkrav";
export const SEND_BUNBLE_TO_DP_SOKNAD_ERROR = "Feil ved lagring av bundle i dp-soknad";
export const DELETE_FILE_FROM_DP_SOKNAD_ERROR = "Feil ved sletting i dp-soknad";
export const DELETE_FILE_FROM_DP_MELLOMLAGRING_ERROR =
  "Feil ved sletting av fil i dp-mellomlagring";
export const SAVE_FILE_FROM_TO_DP_MELLOMLAGRING_ERROR = "Feil ved lagring til dp-mellomlagring";
export const SAVE_FILE_FROM_TO_DP_SOKNAD_ERROR = "Feil ved lagring til dp-soknad";

// Innsending
export const CREATE_INNSENDING_UUID_ERROR = "Feil ved oppretting av innsendings uuid";

// Ettersending
export const PUT_ETTERSENDING_ERROR = "Feil ved ettersending";
export const PUT_FERDIGSTILL_ERROR = "Feil ved ferdigstill";
