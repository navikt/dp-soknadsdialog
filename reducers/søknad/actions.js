export const SUBSUMSJONER_HENTET = "subsumsjoner hentet";
export const subsumsjonerHentet = (subsumsjoner = {}, fakta = []) => ({
  type: SUBSUMSJONER_HENTET,
  subsumsjoner,
  fakta,
});
