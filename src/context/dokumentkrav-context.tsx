import React, { createContext, PropsWithChildren, useState } from "react";
import { IDokumentkravList } from "../types/documentation.types";
import api from "../api.utils";
import { useRouter } from "next/router";

export interface IDokumentkravContext {
  dokumentkravList: IDokumentkravList;
  getDokumentkravList: () => void;
}

export const DokumentkravContext = createContext<IDokumentkravContext | undefined>(undefined);

interface IProps {
  initialState: IDokumentkravList;
}

function DokumentkravProvider(props: PropsWithChildren<IProps>) {
  const router = useRouter();
  const { uuid } = router.query;
  const [dokumentkravList, setDokumentkravList] = useState<IDokumentkravList>(props.initialState);

  async function getDokumentkravList() {
    const dokumentkravResponse = await fetch(api(`documentation/${uuid}`));

    if (dokumentkravResponse.ok) {
      const data = await dokumentkravResponse.json();
      setDokumentkravList(data);
    }
  }

  return (
    <DokumentkravContext.Provider
      value={{
        dokumentkravList,
        getDokumentkravList,
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
