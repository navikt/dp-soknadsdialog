import { NextPageContext } from "next";
import { ErrorPageContent } from "../components/error-page-content/errorPageContent";

interface IProps {
  title: string;
  details: string;
  statusCode?: number;
}

export default function ErrorPage({ statusCode, title, details }: IProps) {
  if (statusCode === 404) {
    return (
      <ErrorPageContent
        title="Fant ikke siden"
        details="Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte
          deg hit."
      />
    );
  }

  return <ErrorPageContent title={title} details={details} />;
}

ErrorPage.getInitialProps = async (contextData: NextPageContext) => {
  const statusCode = contextData.res
    ? contextData.res.statusCode
    : contextData.err
    ? contextData.err.statusCode
    : 404;

  return { statusCode };
};
