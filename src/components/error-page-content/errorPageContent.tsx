import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";

interface IProps {
  title: string;
  details: string;
}
export function ErrorPageContent({ title, details }: IProps) {
  return (
    <main>
      <Heading level="1" size="xlarge" spacing>
        {title}
      </Heading>
      <BodyLong>{details}</BodyLong>
      <Link href="https://www.nav.no/no/ditt-nav" passHref>
        <Button className="my-6" variant="primary" as="a" size="medium">
          Gå til Ditt NAV
        </Button>
      </Link>
    </main>
  );
}
