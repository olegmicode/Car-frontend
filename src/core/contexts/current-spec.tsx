import React from "react";

import { Spec } from "../api";

type CurrentSpecContextValue = {
  currentSpec: Spec | null;

  setCurrentSpec: (spec: Spec | null) => void;
};

export const CurrentSpecContext = React.createContext<
  CurrentSpecContextValue | undefined
>(undefined);

export function CurrentSpecContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSpec, setCurrentSpec] = React.useState<Spec | null>(null);

  return (
    <CurrentSpecContext.Provider
      value={{
        currentSpec,
        setCurrentSpec,
      }}
    >
      {children}
    </CurrentSpecContext.Provider>
  );
}

export function useCurrentSpecContext() {
  const context = React.useContext(CurrentSpecContext);

  if (!context) {
    throw new Error("CurrentSpecContextProvider not found");
  }

  return context;
}
