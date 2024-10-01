export function createSoknadOrkestrator(onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/start`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export interface ISpørsmal {
  id: string;
  tekstnøkkel: string;
  type: "land" | "periode" | "dato" | "tekst" | "boolean";
  svar: any;
  gyldigeSvar: any;
}

export interface IOrkestratorState {
  navn: string;
  nesteSpørsmål: ISpørsmal;
  besvarteSpørsmål: ISpørsmal[];
  erFullført: boolean;
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
