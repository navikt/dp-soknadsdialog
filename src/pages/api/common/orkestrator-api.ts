export function getOrkestratorSoknader(onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/mine-soknader`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
