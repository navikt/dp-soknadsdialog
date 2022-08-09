import React, { PropsWithChildren, useEffect, useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { DocumentationAnswers } from "../../types/documentation.types";

interface Props {
  setAnswers: (value: DocumentationAnswers) => void;
}

export function DocumentQuestions(props: PropsWithChildren<Props>) {
  const [sendeInnSpm, setSendeInnSpm] = useState("");
  const [hvemSenderSpm, setHvemSenderSpm] = useState("");

  useEffect(() => {
    props.setAnswers({ sendeInn: sendeInnSpm, hvemSender: hvemSenderSpm });
  }, [sendeInnSpm, hvemSenderSpm]);

  const selectSendeInn = (val: string) => {
    setSendeInnSpm(val);
  };

  const selectHvemSender = (val: string) => {
    setHvemSenderSpm(val);
  };

  return (
    <>
      <RadioGroup
        legend="Skal du sende dokumentet nå?"
        onChange={selectSendeInn}
        value={sendeInnSpm}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>

      {sendeInnSpm && (
        <RadioGroup
          legend="Hvem skal sende dette dokumentet?"
          onChange={selectHvemSender}
          value={hvemSenderSpm}
        >
          <Radio value="meg">Jeg</Radio>
          <Radio value="noenAndre">Noen andre sender</Radio>
          <Radio value={false}>Det har blitt sendt med en tidligere søknad</Radio>
        </RadioGroup>
      )}

      {sendeInnSpm === "ja" && hvemSenderSpm === "meg" && <>{props.children}</>}
    </>
  );
}
