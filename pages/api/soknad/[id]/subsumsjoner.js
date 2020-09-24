export default async (req, res) => {
  const {
    query: { id },
  } = req;
  const subsumsjoner = await fetch(
    `http://dp-quiz-api/soknad/${id}/subsumsjoner`
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await subsumsjoner.text());
};
