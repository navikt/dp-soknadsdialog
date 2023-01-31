import React, { createContext, PropsWithChildren, useState } from "react";
import api from "../api.utils";
import { useRouter } from "next/router";
import { usePutRequest } from "../hooks/usePutRequest";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";
import { IDokumentkravSvarBody } from "../pages/api/documentation/svar";

export interface IDokumentkravContext {
  dokumentkravList: IDokumentkravList;
  getDokumentkravList: () => void;
  getFirstUnansweredDokumentkrav: () => IDokumentkrav | undefined;
  saveDokumentkravSvar: (value: IDokumentkravSvarBody) => Promise<void>;
}

export const DokumentkravContext = createContext<IDokumentkravContext | undefined>(undefined);

interface IProps {
  initialState: IDokumentkravList;
}

function DokumentkravProvider(props: PropsWithChildren<IProps>) {
  const router = useRouter();
  const { uuid } = router.query;
  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(props.initialState);
  const [saveDokumentkravSvarAsync] = usePutRequest<IDokumentkravSvarBody, IDokumentkravList>(
    "documentation/svar",
    true
  );

  async function getDokumentkravList() {
    const dokumentkravResponse = await fetch(api(`documentation/${uuid}`));

    if (dokumentkravResponse.ok) {
      const data = await dokumentkravResponse.json();
      setDokumentkravList(data);
    }
  }

  async function saveDokumentkravSvar(value: IDokumentkravSvarBody) {
    const updatedDokumentkrav = await saveDokumentkravSvarAsync(value);

    if (updatedDokumentkrav) {
      setDokumentkravList(updatedDokumentkrav);
    }
  }

  function getFirstUnansweredDokumentkrav() {
    return dokumentkravList.krav.find((dokumentkrav) => {
      if (!dokumentkrav.svar) {
        return true;
      } else if (dokumentkrav.svar === "dokumentkrav.svar.send.naa") {
        return dokumentkrav.filer.length === 0;
      } else {
        return !dokumentkrav.begrunnelse;
      }
    });
  }

  return (
    <DokumentkravContext.Provider
      value={{
        dokumentkravList,
        getDokumentkravList,
        getFirstUnansweredDokumentkrav,
        saveDokumentkravSvar,
      }}
    >
      {props.children}
    </DokumentkravContext.Provider>
  );
}

function useDokumentkrav() {
  const context = React.useContext(DokumentkravContext);
  if (context === undefined) {
    throw new Error("useDokumentkrav must be used within a DokumentkravProvider");
  }
  return context;
}

export { DokumentkravProvider, useDokumentkrav };
