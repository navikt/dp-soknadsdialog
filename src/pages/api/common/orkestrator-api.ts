export function createSoknadOrkestrator(onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/start`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
