import React from "react";

export interface ErrorPage {
  error: string;
}
export function ErrorPage({ error }: ErrorPage) {
  return <div className="text-rose-400">{error}</div>;
}
