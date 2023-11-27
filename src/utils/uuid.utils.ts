// Prevent Server Side Request Forgery
export function validateUUID(uuid: string) {
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  const isValidUUID = uuidPattern.test(uuid);

  if (!isValidUUID) {
    throw Error("Ugyldig uuid");
  }
}
