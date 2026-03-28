import { createContext, useContext, useState } from "react";

const ContextState = createContext();

export function ContextProvider({ children }) {
  const [context, setContext] = useState("General");

  return (
    <ContextState.Provider value={{ context, setContext }}>
      {children}
    </ContextState.Provider>
  );
}

export function useContextState() {
  return useContext(ContextState);
}