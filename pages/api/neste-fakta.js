export default async (req, res) => {
  const fakta = await fetch("http://dp-quiz/neste-fakta");

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await fakta.text());
};
