export default async (req, res) => {

    const nySøknad = await fetch(
        `${process.env.API_BASE_URL}/soknad`, {
            method: "POST",
        }
    );


    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(await nySøknad.text());
};
