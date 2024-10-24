export function getOrkestratorState(onBehalfOfToken: string, uuid: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/${uuid}/neste`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
