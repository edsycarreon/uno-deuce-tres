"use client";

import React from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useError } from "@/contexts/ErrorContext";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  error: {
    message: string;
    title?: string;
    type?: "error" | "warning" | "info";
    code?: string;
    details?: string;
  } | null;
}

const getErrorIcon = (type?: "error" | "warning" | "info") => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case "info":
      return <Info className="h-6 w-6 text-blue-500" />;
    case "error":
    default:
      return <XCircle className="h-6 w-6 text-red-500" />;
  }
};

const getErrorColor = (type?: "error" | "warning" | "info") => {
  switch (type) {
    case "warning":
      return "border-yellow-200 bg-yellow-50";
    case "info":
      return "border-blue-200 bg-blue-50";
    case "error":
    default:
      return "border-red-200 bg-red-50";
  }
};

export const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onClose,
  error,
}) => {
  if (!error) return null;

  const { type = "error", title, message, details, code } = error;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="error-modal">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getErrorIcon(type)}
            <DialogTitle className="text-left">
              {title ||
                (type === "error"
                  ? "Error"
                  : type === "warning"
                  ? "Warning"
                  : "Information")}
            </DialogTitle>
          </div>
          {code && (
            <DialogDescription className="text-xs text-muted-foreground">
              Error Code: {code}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={`rounded-lg border p-4 ${getErrorColor(type)}`}>
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {details && <p className="mt-2 text-xs text-gray-600">{details}</p>}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Global error modal that uses the error context
export const GlobalErrorModal: React.FC = () => {
  const { currentError, isErrorModalOpen, hideError } = useError();

  return (
    <ErrorModal
      open={isErrorModalOpen}
      onClose={hideError}
      error={currentError}
    />
  );
};
