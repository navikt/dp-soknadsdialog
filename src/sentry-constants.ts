interface IFetchErrorType {
  message: string;
  type: string;
}

export type FetchErrorType =
  | typeof GET_PERSONALIA_ERROR
  | typeof GET_SOKNAD_STATE_ERROR
  | typeof GET_DOKUMENTKRAV_ERROR
  | typeof GET_MINE_SOKNADER_ERROR
  | typeof GET_ARBEIDSSOKER_STATUS_ERROR
  | typeof CREATE_INNSENDING_UUID_ERROR;

export const GET_PERSONALIA_ERROR: IFetchErrorType = {
  type: "GET_PERSONALIA_ERROR",
  message: "Feil ved henting av personalia",
};

export const GET_SOKNAD_STATE_ERROR: IFetchErrorType = {
  type: "GET_SOKNAD_STATE_ERROR",
  message: "Feil ved henting av søknadsstate",
};

export const GET_DOKUMENTKRAV_ERROR: IFetchErrorType = {
  type: "GET_DOKUMENTKRAV_ERROR",
  message: "Feil ved henting av dokumentskrav",
};

export const GET_ARBEIDSSOKER_STATUS_ERROR: IFetchErrorType = {
  type: "GET_ARBEIDSSOKER_STATUS_ERROR",
  message: "Feil ved henting av arbeidssøker status",
};

export const GET_MINE_SOKNADER_ERROR: IFetchErrorType = {
  type: "GET_MINE_SOKNADER_ERROR",
  message: "Feil ved henting av mine søknader",
};

export const CREATE_INNSENDING_UUID_ERROR: IFetchErrorType = {
  type: "CREATE_INNSENDING_UUID_ERROR",
  message: "Feil ved oppretting av innsendings uuid",
};
