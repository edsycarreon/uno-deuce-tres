"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ErrorInfo } from "@/lib/utils/errorHandler";

interface ErrorContextType {
  showError: (error: ErrorInfo | string) => void;
  hideError: () => void;
  currentError: ErrorInfo | null;
  isErrorModalOpen: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [currentError, setCurrentError] = useState<ErrorInfo | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const showError = useCallback((error: ErrorInfo | string) => {
    const errorInfo: ErrorInfo =
      typeof error === "string" ? { message: error, title: "Error" } : error;

    setCurrentError(errorInfo);
    setIsErrorModalOpen(true);
  }, []);

  const hideError = useCallback(() => {
    setIsErrorModalOpen(false);
    setCurrentError(null);
  }, []);

  const value: ErrorContextType = {
    showError,
    hideError,
    currentError,
    isErrorModalOpen,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
