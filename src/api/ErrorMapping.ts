import { AppErrorCode } from "./AppErrorCodes";

export const ErrorMessages: Record<string, string> = {
  [AppErrorCode.NetworkError]:
    "Nie udało się połączyć z serwerem. Sprawdź połączenie internetowe.",
  [AppErrorCode.ServerError]:
    "Wystąpił błąd wewnętrzny serwera. Spróbuj później.",
  [AppErrorCode.AuthInvalidCredentials]: "Nieprawidłowy login lub hasło.",
  [AppErrorCode.AuthTokenExpired]: "Sesja wygasła. Zaloguj się ponownie.",
  [AppErrorCode.ProductNotFound]: "Szukany produkt nie istnieje.",
  [AppErrorCode.Unknown]: "Wystąpił nieoczekiwany błąd.",
};

export const getErrorMessage = (
  code?: string,
  fallbackMessage?: string,
): string => {
  if (code && ErrorMessages[code]) {
    return ErrorMessages[code];
  }
  return fallbackMessage || ErrorMessages[AppErrorCode.Unknown];
};
