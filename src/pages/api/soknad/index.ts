import proxy from "../_proxy";

const søknadHandler = async (req, res) => {
  const url = new URL(`${process.env.API_BASE_URL}/soknad`);
  await proxy(url, req, res);
};

export default søknadHandler;
