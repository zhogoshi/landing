"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Button, Result, SmoothScroll, ThemeProvider, Toaster, TooltipProvider } from "@hogoshi/ui";
import { useState, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createQueryClient } from "@/shared/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SmoothScroll>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <Result title="This page couldn't load" description={error instanceof Error ? error.message : "Something went wrong."}>
                  <Button onClick={resetErrorBoundary}>Reload</Button>
                  <Button variant="ghost" render={<a href="/" />}>
                    Home
                  </Button>
                </Result>
              )}
            >
              {children}
            </ErrorBoundary>
            <Toaster />
          </QueryClientProvider>
        </SmoothScroll>
      </TooltipProvider>
    </ThemeProvider>
  );
}
