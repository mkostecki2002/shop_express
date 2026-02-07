export const AppErrorCode = {
  NetworkError: "NETWORK_ERROR",
  ServerError: "SERVER_ERROR",

  AuthInvalidCredentials: "AUTH_INVALID_CREDENTIALS",
  AuthUserNotFound: "AUTH_USER_NOT_FOUND",
  AuthTokenExpired: "AUTH_TOKEN_EXPIRED",

  ValidationError: "VALIDATION_ERROR",
  ProductNotFound: "PRODUCT_NOT_FOUND",
  OrderCannotBeRated: "ORDER_CANNOT_BE_RATED",

  Unknown: "UNKNOWN_ERROR",
} as const;
