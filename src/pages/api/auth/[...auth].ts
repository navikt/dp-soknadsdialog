import DpAuth from "@navikt/dp-auth";

export default DpAuth({
  allowedDestinations: ["/", "/soknad", "/routing"],
});
