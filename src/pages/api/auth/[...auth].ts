import DpAuth from "@navikt/dp-auth";

export default DpAuth({
  allowedDestinations: ["/", "/dialog", "/routing"],
});
