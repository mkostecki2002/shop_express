import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AppError {
  status: number;
  message: string;
}

interface AppContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  errorMessage: string | null;
  setErrorMessage: (value: string | null) => void;

  message: string | null;
  setMessage: (value: string | null) => void;
  clearMessage: () => void;

  errorStatus: number | null;
  setErrorStatus: (value: number | null) => void;

  clearError: () => void;
  handleError: (err: AppError) => void;
}

export const AppContext = createContext<AppContextType>({
  isLoading: false,
  setIsLoading: () => {},

  errorMessage: null,
  setErrorMessage: () => {},

  message: null,
  setMessage: () => {},
  clearMessage: () => {},

  errorStatus: null,
  setErrorStatus: () => {},

  clearError: () => {},
  handleError: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearError = (): void => {
    setErrorMessage(null);
  };

  const clearMessage = (): void => {
    setMessage(null);
  };

  const handleError = (err: AppError): void => {
    setErrorMessage(err.message);
    setErrorStatus(err.status);

    if (err.status >= 500 || err.status === 0 || err.status === 404) {
      navigate("/error-page");
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        errorMessage,
        setErrorMessage,
        message,
        setMessage,
        clearMessage,
        errorStatus,
        setErrorStatus,
        clearError,
        handleError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext)!;
