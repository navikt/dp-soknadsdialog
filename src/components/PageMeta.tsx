import Head from "next/head";

interface IProps {
  title: string;
  metaDescription: string;
}

export function PageMeta(props: IProps) {
  const { title, metaDescription } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={metaDescription} key="title" />
    </Head>
  );
}
