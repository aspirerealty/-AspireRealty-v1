"use client"; // Error boundaries must be Client Components

import ErrorState from "@/components/brand/ErrorState";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorState error={error} retry={retry} />;
}
