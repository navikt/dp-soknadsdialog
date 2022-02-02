import { GetStaticPropsResult } from "next";
import { Seksjon } from "../components/seksjon/Seksjon";
import { host } from "../api.utils";
import { ISoknad } from "./api/soknad";

export async function getServerSideProps(): Promise<GetStaticPropsResult<ISoknad>> {
  // Denne skal fetche quiz faktum med svar
  const soknad: ISoknad = await fetch(`${host}/api/soknad`).then((data) => {
    return data.json();
  });

  return {
    props: soknad,
  };
}

export default function Soknad(props: ISoknad) {
  console.log(props.sections);
  return props.sections.map((section) => <Seksjon key={section.id} {...section} />);
}
