// components/ClientDateTime.tsx
"use client";

import { useState, useEffect } from "react";

interface ClientDateTimeProps {
  dateString: string;
  format?: (date: Date) => string;
}

const defaultFormat = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const ClientDateTime = ({
  dateString,
  format = defaultFormat,
}: ClientDateTimeProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On the server and during initial client render, render nothing or a placeholder
  if (!isMounted) {
    return null; // This guarantees no mismatch
  }

  const date = new Date(dateString);

  return <time dateTime={dateString}>{format(date)}</time>;
};
