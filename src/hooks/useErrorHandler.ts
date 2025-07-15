import { useCallback } from "react";
import { useError } from "@/contexts/ErrorContext";
import {
  handleFirebaseError,
  handleNetworkError,
  handleValidationError,
  type ErrorInfo,
} from "@/lib/utils/errorHandler";

export const useErrorHandler = () => {
  const { showError } = useError();

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      let errorInfo: ErrorInfo;

      if (customMessage) {
        errorInfo = {
          message: customMessage,
          title: "Error",
        };
      } else {
        // Try to determine the type of error and handle accordingly
        if (error instanceof TypeError && error.message.includes("fetch")) {
          errorInfo = handleNetworkError(error);
        } else if (error && typeof error === "object" && "code" in error) {
          errorInfo = handleFirebaseError(error);
        } else if (error && typeof error === "object" && "message" in error) {
          errorInfo = handleValidationError(error);
        } else {
          errorInfo = {
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            title: "Error",
          };
        }
      }

      showError(errorInfo);
    },
    [showError]
  );

  const handleFirebaseErrorWithModal = useCallback(
    (error: unknown) => {
      const errorInfo = handleFirebaseError(error);
      showError(errorInfo);
    },
    [showError]
  );

  const handleNetworkErrorWithModal = useCallback(
    (error: unknown) => {
      const errorInfo = handleNetworkError(error);
      showError(errorInfo);
    },
    [showError]
  );

  const handleValidationErrorWithModal = useCallback(
    (error: unknown) => {
      const errorInfo = handleValidationError(error);
      showError(errorInfo);
    },
    [showError]
  );

  const showCustomError = useCallback(
    (message: string, title?: string, type?: "error" | "warning" | "info") => {
      showError({
        message,
        title: title || "Error",
        type: type || "error",
      });
    },
    [showError]
  );

  return {
    handleError,
    handleFirebaseErrorWithModal,
    handleNetworkErrorWithModal,
    handleValidationErrorWithModal,
    showCustomError,
  };
};
