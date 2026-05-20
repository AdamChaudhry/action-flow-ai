import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AnalysisResult } from '../types/analysis';

interface AnalysisResultContextValue {
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult) => void;
  /** Clears cached result, e.g. when starting a new job. */
  clearResult: () => void;
}

const AnalysisResultContext = createContext<AnalysisResultContextValue | null>(null);

export const AnalysisResultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [result, setResultState] = useState<AnalysisResult | null>(null);

  const setResult = useCallback((r: AnalysisResult) => {
    setResultState(r);
  }, []);

  const clearResult = useCallback(() => {
    setResultState(null);
  }, []);

  return (
    <AnalysisResultContext.Provider value={{ result, setResult, clearResult }}>
      {children}
    </AnalysisResultContext.Provider>
  );
};

/** Returns the cached full analysis result, or null if not yet fetched. */
export function useAnalysisResult(): AnalysisResultContextValue {
  const ctx = useContext(AnalysisResultContext);
  if (!ctx) {
    throw new Error('useAnalysisResult must be used inside AnalysisResultProvider');
  }
  return ctx;
}
