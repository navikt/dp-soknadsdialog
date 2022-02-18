import React from "react";
import { Provider } from "react-redux";
import { store } from "../../store";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function SoknadMedId() {
  return <Provider store={store}>Morna! </Provider>;
}
