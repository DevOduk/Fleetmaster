// client-site/[tenant]/layout.tsx
import React from "react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root-wrapper">{children}</div>;
}
