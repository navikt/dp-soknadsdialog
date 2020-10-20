export default async (req, res) => {
  const {
    query: { id },
  } = req;
  const subsumsjoner = await fetch(
    `${process.env.API_BASE_URL}/soknad/${id}/subsumsjoner`
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await subsumsjoner.text());
};
