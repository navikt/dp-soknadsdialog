import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";

interface IProps {
  title: string;
  details: string;
}
export function ErrorPageContent({ title, details }: IProps) {
  const titleWithFallback = title ?? "Det har skjedd en teknisk feil";
  const detailsWithFallback = details ?? "Beklager, vi mistet kontakten med systemene våre.";

  return (
    <main id="maincontent" tabIndex={-1}>
      <Heading level="1" size="xlarge" spacing>
        {titleWithFallback}
      </Heading>
      <BodyLong>{detailsWithFallback}</BodyLong>
      <Link href="https://www.nav.no/minside" passHref legacyBehavior>
        <Button className="my-6" variant="primary" as="a" size="medium">
          Gå til Min side
        </Button>
      </Link>
    </main>
  );
}
