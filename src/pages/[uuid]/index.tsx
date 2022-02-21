import React from "react";
import { Provider } from "react-redux";
import { initialiseStore, RootState } from "../../store";
import { Soknad } from "../../components/view/Soknad";
import { GetServerSidePropsResult } from "next/types";

export async function getServerSideProps(): Promise<GetServerSidePropsResult<RootState>> {
  const response: Response = await fetch(
    `${process.env.SELF_URL}/api/soknad/localhost-uuid/initialize`
  );
  const initialReduxState: RootState = await response.json();

  return {
    props: { ...initialReduxState },
  };
}

export default function SoknadMedId(props: RootState) {
  const reduxStore = initialiseStore(props);

  return (
    <Provider store={reduxStore}>
      <Soknad />
    </Provider>
  );
}
