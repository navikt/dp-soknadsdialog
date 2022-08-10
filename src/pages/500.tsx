import React from "react";
import Error from "../components/error/Error";

export default function Error500() {
  return (
    <Error
      variant="error"
      title="Beklager, det skjedde en teknisk feil."
      details="Feilen blir automatisk rapportert og vi jobber med å løse den så raskt som mulig. Prøv igjen
        om litt."
    />
  );
}
