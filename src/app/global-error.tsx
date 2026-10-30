"use client";

import "./globals.css";
import ErrorState from "@/components/brand/ErrorState";

// Replaces the root layout if the layout itself fails, so it brings its own
// <html>/<body> and styles.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-IN">
      <body>
        <ErrorState error={error} retry={retry} />
      </body>
    </html>
  );
}
