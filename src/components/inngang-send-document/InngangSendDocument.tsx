import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { IMineSoknader } from "../../types/quiz.types";
import Link from "next/link";

export function InngangSendDocument({ innsendte }: IMineSoknader) {
  const router = useRouter();
  const [navigateToRepeiptPageUuuid, setNavigateToReceiptPageUuid] = useState<string | undefined>();

  function navigateToReceiptPage(uuid: string) {
    setNavigateToReceiptPageUuid(uuid);
    router.push(`/${uuid}/kvittering`);
  }

  return (
    <>
      {innsendte?.map((soknad) => {
        return (
          <div key={soknad.uuid}>
            Innsendt soknad : først innsendt {soknad.forstInnsendt}
            <Link href="#" passHref>
              <Button
                as="a"
                onClick={() => navigateToReceiptPage(soknad.uuid)}
                loading={soknad.uuid === navigateToRepeiptPageUuuid}
              >
                Send inn dokumenter
              </Button>
            </Link>
          </div>
        );
      })}
    </>
  );
}
