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

  if (!isMounted) {
    return null;
  }

  const date = new Date(dateString);

  return <time dateTime={dateString}>{format(date)}</time>;
};
