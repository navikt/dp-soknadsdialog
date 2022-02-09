import React from "react";
import { GetStaticPropsResult } from "next";
import { Seksjon } from "../components/seksjon/Seksjon";
import api, { host } from "../api.utils";
import { ISoknad } from "./api/soknad";

export async function getServerSideProps(): Promise<GetStaticPropsResult<ISoknad>> {
  // Denne skal fetche quiz faktum med svar
  const soknad: ISoknad = await fetch(new URL(`${api("soknad")}`, host).href).then((data) => {
    return data.json();
  });

  return {
    props: soknad,
  };
}

export default function Soknad(props: ISoknad) {
  return props.sections.map((section) => <Seksjon key={section.id} {...section} />);
}
