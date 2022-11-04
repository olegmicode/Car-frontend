import React from "react";

import { Spec, apiClient } from "../api";
import { useAsync } from "../hooks/use-async";

type SpecContextValue = {
  specs: Spec[];
  isLoading: boolean;
  reload: (inBackground?: boolean) => void;
};

const SpecContext = React.createContext<SpecContextValue | undefined>(
  undefined
);

export type SpecContextProviderProps = {
  children?: React.ReactNode;
  render?: (value: SpecContextValue) => React.ReactNode;
};

export function SpecContextProvider({
  children,
  render,
}: SpecContextProviderProps) {
  const [loadSpecs, { data: specs = [], isLoading }] = useAsync(
    apiClient.loadSpecs
  );

  React.useEffect(() => {
    loadSpecs();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      specs,
      isLoading,
      reload: loadSpecs,
    }),
    [specs, isLoading]
  );

  const finalChildren = React.useMemo(
    () => (render ? render(contextValue) : children),
    [contextValue]
  );

  return (
    <SpecContext.Provider value={contextValue}>
      {finalChildren}
    </SpecContext.Provider>
  );
}

export function useSpecContext() {
  const context = React.useContext(SpecContext);

  if (!context) throw new Error("SpecContextProvider not found");

  return context;
}
