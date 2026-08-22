import type { ReactNode } from "react";

export function ReleaseNote({
  children,
  summary,
  version = "Ver 1.0.0",
}: {
  children: ReactNode;
  summary: string;
  version?: string;
}) {
  return (
    <div className="home-post-detail-slot release-note-v1">
      <div className="release-note-hero">
        <span>{version}</span>
        <strong>{summary}</strong>
      </div>
      <div className="release-note-grid">{children}</div>
    </div>
  );
}

export function ReleaseSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="release-note-section">
      <h4>{title}</h4>
      <div>{children}</div>
    </section>
  );
}
