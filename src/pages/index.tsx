import { GetStaticPropsResult } from "next";
import { ISeksjon, Seksjon } from "../components/seksjon/Seksjon";
import { host } from "../api.utils";

export interface Soknad {
  sections: ISeksjon[];
}

export async function getServerSideProps(): Promise<GetStaticPropsResult<Soknad>> {
  // Denne skal fetche quiz faktum med svar
  const soknad: Soknad = await fetch(`${host}/api/soknad`).then((data) => {
    return data.json();
  });

  return {
    props: { sections: sanitySections },
  };
}

export default function Soknad(props: Soknad) {
  return <Seksjon {...props.sections[0]} />;
}
