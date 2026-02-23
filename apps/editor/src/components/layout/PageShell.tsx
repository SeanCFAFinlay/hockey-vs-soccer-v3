import React from 'react';

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export default function PageShell({ title, children }: PageShellProps) {
  return (
    <main className="page-shell">
      <h1 className="page-title">{title}</h1>
      {children}
    </main>
  );
}
