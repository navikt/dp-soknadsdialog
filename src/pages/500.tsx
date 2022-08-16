import React from "react";
import Error from "../components/error/Error";

export default function Error500() {
  const storage = localStorage.getItem("errorCount");

  if (storage) {
    localStorage.removeItem("errorCount");
  }

  return (
    <Error
      variant="error"
      title="Beklager, det skjedde en teknisk feil."
      details="Vi jobber med å løse den så raskt som mulig. Prøv igjen
        om litt."
    />
  );
}
