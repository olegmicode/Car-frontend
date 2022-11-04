import React from "react";

import { Field, apiClient, FieldOption } from "../api";
import { useAsync } from "../hooks/use-async";

type FieldContextValue = {
  fields: Field[];
  isLoading: boolean;
  optionsById: Record<string, FieldOption>;
  reload: (inBackground?: boolean) => void;
};

const FieldContext = React.createContext<FieldContextValue | undefined>(
  undefined
);

export type FieldContextProviderProps = {
  children?: React.ReactNode;
  render?: (value: FieldContextValue) => React.ReactNode;
};

export function FieldContextProvider({
  children,
  render,
}: FieldContextProviderProps) {
  const [loadFields, { data: fields = [], isLoading }] = useAsync(
    apiClient.loadFields
  );

  React.useEffect(() => {
    loadFields();
  }, []);

  const contextValue = React.useMemo(() => {
    const optionsById: Record<string, FieldOption> = {};

    fields.forEach((field) => {
      field.options.forEach((option) => {
        optionsById[option._id] = option;
      });
    });

    return {
      fields,
      isLoading,
      reload: loadFields,
      optionsById,
    };
  }, [fields, isLoading]);

  const finalChildren = React.useMemo(
    () => (render ? render(contextValue) : children),
    [contextValue]
  );

  return (
    <FieldContext.Provider value={contextValue}>
      {finalChildren}
    </FieldContext.Provider>
  );
}

export function useFieldContext() {
  const context = React.useContext(FieldContext);

  if (!context) throw new Error("FieldContextProvider not found");

  return context;
}
