import { createContext, useState } from "react";

// Create a context to store the reload state

export const AgentContext = createContext();

const AgentProvider = ({ children }) => {
  const [reload, setReload] = useState(null);

  return (
    <AgentContext.Provider value={{ reload, setReload }}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
