import proxy from "../../_proxy";

export default async (req, res) => {
  const {
    query: { id },
  } = req;
  const url = new URL(`http://localhost:8080/soknad/${id}/neste-seksjon`);
  await proxy(url, req, res);
};
