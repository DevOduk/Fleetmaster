// client-site/[tenant]/layout.tsx
import React from "react";

export default function TenantRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tenant-root-wrapper">
      {children}
    </div>
  );
}