export async function getOrkestratorState(onBehalfOfToken: string, uuid: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/${uuid}/neste`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export async function getLandgrupper() {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/landgrupper`;

  return fetch(url, {
    method: "GET",
  });
}
