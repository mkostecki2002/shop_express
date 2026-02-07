import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { AppErrorCode } from "../api/AppErrorCodes";
import { getErrorMessage } from "../api/ErrorMapping";

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

  const handleError = (err: any) => {
    let status = 0;
    let code: string = AppErrorCode.Unknown;
    let apiMessage = "";

    if (isAxiosError(err)) {
      if (err.response) {
        status = err.response.status;
        const data = err.response.data as any;
        code = data?.code || AppErrorCode.Unknown;
        apiMessage = data?.message;
      } else if (err.request) {
        status = 0;
        code = AppErrorCode.NetworkError;
      }
    } else {
      // Błąd JS / Inny
      status = -1;
      apiMessage = err.message;
    }

    // Pobierz ładny komunikat po polsku
    const userFriendlyMessage = getErrorMessage(code, apiMessage);

    // Błędy Krytyczne -> Przekierowanie na stronę błędu
    if (status === 0 || status >= 500 || status === 404) {
      setErrorStatus(status);
      setErrorMessage(userFriendlyMessage);
      navigate("/error-page");
      return;
    }

    // Błędy Użytkownika -> Baner
    setErrorStatus(status);
    setErrorMessage(userFriendlyMessage);

    // Autoryzacja -> Przekierowanie do logowania
    if (status === 401 || status === 403) {
      navigate("/login");
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
