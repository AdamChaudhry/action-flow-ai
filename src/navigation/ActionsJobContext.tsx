import { createContext, useContext } from 'react';

const ActionsJobContext = createContext<string | undefined>(undefined);

export const ActionsJobProvider = ActionsJobContext.Provider;

export function useActionsJobId(): string | undefined {
  return useContext(ActionsJobContext);
}
