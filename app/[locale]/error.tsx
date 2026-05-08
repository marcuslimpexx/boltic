"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-5xl mb-4">⚡</p>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/">Go home</a>
        </Button>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-6 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
