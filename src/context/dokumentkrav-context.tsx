import React, { createContext, PropsWithChildren, useState } from "react";
import { usePutRequest } from "../hooks/usePutRequest";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";
import { IDokumentkravSvarBody } from "../pages/api/documentation/svar";

export interface IDokumentkravContext {
  dokumentkravList: IDokumentkravList;
  getFirstUnansweredDokumentkrav: () => IDokumentkrav | undefined;
  saveDokumentkravSvar: (value: IDokumentkravSvarBody) => Promise<void>;
  updateDokumentkravList: (value: IDokumentkrav) => void;
}

export const DokumentkravContext = createContext<IDokumentkravContext | undefined>(undefined);

interface IProps {
  initialState: IDokumentkravList;
}

function DokumentkravProvider(props: PropsWithChildren<IProps>) {
  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(props.initialState);
  const [saveDokumentkravSvarAsync] = usePutRequest<IDokumentkravSvarBody, IDokumentkravList>(
    "documentation/svar",
    true
  );

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

  function updateDokumentkravList(dokumentkrav: IDokumentkrav) {
    const tempList = { ...dokumentkravList };
    const indexOfKrav = tempList.krav.findIndex((f) => f.id === dokumentkrav.id);

    if (indexOfKrav !== -1) {
      tempList.krav[indexOfKrav] = { ...dokumentkrav };
      setDokumentkravList(tempList);
    }
  }

  return (
    <DokumentkravContext.Provider
      value={{
        dokumentkravList,
        getFirstUnansweredDokumentkrav,
        saveDokumentkravSvar,
        updateDokumentkravList,
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
