import React from "react";
import { Provider } from "react-redux";
import { initialiseStore, RootState } from "../../store";
import { Soknad } from "../../components/view/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<RootState>> {
  const { query } = context;
  const uuid = query.uuid;
  const response: Response = await fetch(`${process.env.SELF_URL}/api/soknad/${uuid}/initialize`);
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
