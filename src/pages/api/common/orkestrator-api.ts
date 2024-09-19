export function createSoknadOrkestrator(onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/start`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export type SpørsmålTypes = "LAND" | "PERIODE" | "DATO" | "TEKST" | "BOOLEAN";

export interface ISpørsmal {
  id: string;
  tekstnøkkel: string;
  type: SpørsmålTypes;
  /* eslint-disable */
  svar: any;
  gyldigeSvar: any;
  /* eslint-enable */
}

export interface ISpørsmålGruppe {
  id: number;
  navn: string;
  nesteSpørsmål: ISpørsmal;
  besvarteSpørsmål: ISpørsmal[];
}

export function getNesteOrkestratorSporsmal(uuid: string, onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/${uuid}/neste`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
