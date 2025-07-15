import { ERROR_MESSAGES } from "@/constants";

export interface ErrorInfo {
  message: string;
  title?: string;
  type?: "error" | "warning" | "info";
  code?: string;
  details?: string;
}

export class AppError extends Error {
  public code?: string;
  public type: "error" | "warning" | "info";
  public details?: string;

  constructor(
    message: string,
    code?: string,
    type: "error" | "warning" | "info" = "error",
    details?: string
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.type = type;
    this.details = details;
  }
}

export const createError = (
  message: string,
  code?: string,
  type: "error" | "warning" | "info" = "error",
  details?: string
): AppError => {
  return new AppError(message, code, type, details);
};

export const handleFirebaseError = (error: unknown): ErrorInfo => {
  if (error && typeof error === "object" && "code" in error) {
    const errorCode = error.code as string;

    switch (errorCode) {
      // Authentication errors
      case "auth/user-not-found":
        return {
          message: "No account found with this email address",
          title: "Account Not Found",
          code: errorCode,
        };
      case "auth/wrong-password":
        return {
          message: "Incorrect password. Please try again.",
          title: "Invalid Password",
          code: errorCode,
        };
      case "auth/invalid-email":
        return {
          message: "Please enter a valid email address",
          title: "Invalid Email",
          code: errorCode,
        };
      case "auth/email-already-in-use":
        return {
          message: "An account with this email already exists",
          title: "Email Already Exists",
          code: errorCode,
        };
      case "auth/weak-password":
        return {
          message: "Password is too weak. Please choose a stronger password",
          title: "Weak Password",
          code: errorCode,
        };
      case "auth/too-many-requests":
        return {
          message: "Too many failed attempts. Please try again later",
          title: "Too Many Attempts",
          code: errorCode,
        };
      case "auth/network-request-failed":
        return {
          message: ERROR_MESSAGES.NETWORK_ERROR,
          title: "Network Error",
          code: errorCode,
        };

      // Firestore errors
      case "permission-denied":
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          title: "Access Denied",
          code: errorCode,
        };
      case "not-found":
        return {
          message: ERROR_MESSAGES.USER_NOT_FOUND,
          title: "Not Found",
          code: errorCode,
        };
      case "already-exists":
        return {
          message: "This resource already exists",
          title: "Already Exists",
          code: errorCode,
        };

      default:
        return {
          message:
            "message" in error && typeof error.message === "string"
              ? error.message
              : ERROR_MESSAGES.DATABASE_ERROR,
          title: "Error",
          code: errorCode,
        };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      title: "Error",
    };
  }

  return {
    message: "An unknown error occurred",
    title: "Error",
  };
};

export const handleNetworkError = (error: unknown): ErrorInfo => {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      title: "Network Error",
      code: "NETWORK_ERROR",
    };
  }

  return handleFirebaseError(error);
};

export const handleValidationError = (error: unknown): ErrorInfo => {
  if (error && typeof error === "object" && "message" in error) {
    return {
      message: error.message as string,
      title: "Validation Error",
      type: "warning",
    };
  }

  return {
    message: ERROR_MESSAGES.VALIDATION_ERROR,
    title: "Validation Error",
    type: "warning",
  };
};
