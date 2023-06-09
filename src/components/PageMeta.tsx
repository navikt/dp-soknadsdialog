import Head from "next/head";

interface IProps {
  title: string;
  description?: string;
}

export function PageMeta(props: IProps) {
  const { title, description } = props;

  return (
    <Head>
      <title>{title}</title>
      {description && <meta property="og:title" content={description} key="title" />}
    </Head>
  );
}
