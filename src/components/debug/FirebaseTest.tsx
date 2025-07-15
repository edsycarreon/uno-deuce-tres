"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/config";

import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FirebaseTest() {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("Unknown");

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setStatus("Testing Firestore connection...");

      // Test Firestore connection
      const testCollection = collection(db, "test");
      await getDocs(testCollection);

      setStatus("✅ Firestore connection successful!");
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setStatus("❌ Firestore connection failed");
      setError(errorMessage);
      console.error("Firebase test error:", err);
    }
  };

  const testAuthConnection = async () => {
    try {
      setAuthStatus("Testing Auth connection...");

      // Test Auth connection by getting current user
      const currentUser = auth.currentUser;
      setAuthStatus(
        `✅ Auth connection successful! Current user: ${
          currentUser ? currentUser.email : "None"
        }`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setAuthStatus(`❌ Auth connection failed: ${errorMessage}`);
      console.error("Auth test error:", err);
    }
  };

  return (
    <Card className="border-2 border-[color:var(--color-border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">Firestore Status:</p>
          <p className="text-sm">{status}</p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <div>
          <p className="font-medium">Auth Status:</p>
          <p className="text-sm">{authStatus}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={testFirebaseConnection} size="sm">
            Test Firestore
          </Button>
          <Button onClick={testAuthConnection} size="sm">
            Test Auth
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
        </div>
      </CardContent>
    </Card>
  );
}
