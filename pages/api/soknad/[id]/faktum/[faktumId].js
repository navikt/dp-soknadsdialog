export default async (req, res) => {
  const {
    query: { id, faktumId },
  } = req;
  const fakta = await fetch(
    `http://dp-quiz-api/soknad/${id}/faktum/${faktumId}`,
    { method: "PUT", body: req.body }
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await fakta.text());
};
