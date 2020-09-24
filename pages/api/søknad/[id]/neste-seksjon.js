export default async (req, res) => {
  const {
    query: { id },
  } = req;
  const fakta = await fetch(`http://dp-quiz-api/søknad/${id}/neste-seksjon`);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await fakta.text());
};
