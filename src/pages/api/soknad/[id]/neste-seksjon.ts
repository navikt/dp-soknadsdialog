import proxy from "../../_proxy";

export default async (req, res) => {
  const {
    query: { id },
  } = req;
  const url = new URL(`${process.env.API_BASE_URL}/soknad/${id}/neste-seksjon`);
  await proxy(url, req, res);
};
