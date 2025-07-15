"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export function ErrorDemo() {
  const {
    handleError,
    handleFirebaseErrorWithModal,
    handleNetworkErrorWithModal,
    handleValidationErrorWithModal,
    showCustomError,
  } = useErrorHandler();

  const demoFirebaseError = () => {
    const error = new Error("auth/user-not-found");
    Object.assign(error, { code: "auth/user-not-found" });
    handleFirebaseErrorWithModal(error);
  };

  const demoNetworkError = () => {
    const error = new TypeError("fetch failed");
    handleNetworkErrorWithModal(error);
  };

  const demoValidationError = () => {
    const error = new Error("Email is required");
    handleValidationErrorWithModal(error);
  };

  const demoCustomError = () => {
    showCustomError(
      "This is a custom error message with a custom title!",
      "Custom Error",
      "warning"
    );
  };

  const demoGenericError = () => {
    const error = new Error("Something went wrong");
    handleError(error, "Generic error occurred");
  };

  const demoInfoMessage = () => {
    showCustomError(
      "This is an informational message for the user.",
      "Information",
      "info"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Handling Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={demoFirebaseError} variant="outline">
            Firebase Error
          </Button>
          <Button onClick={demoNetworkError} variant="outline">
            Network Error
          </Button>
          <Button onClick={demoValidationError} variant="outline">
            Validation Error
          </Button>
          <Button onClick={demoCustomError} variant="outline">
            Custom Error
          </Button>
          <Button onClick={demoGenericError} variant="outline">
            Generic Error
          </Button>
          <Button onClick={demoInfoMessage} variant="outline">
            Info Message
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Click any button to see the error modal in action!</p>
          <ul className="mt-2 space-y-1">
            <li>• Firebase Error: Shows authentication error</li>
            <li>• Network Error: Shows network connectivity error</li>
            <li>• Validation Error: Shows form validation error</li>
            <li>• Custom Error: Shows custom error with warning type</li>
            <li>• Generic Error: Shows generic error handling</li>
            <li>• Info Message: Shows informational message</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
