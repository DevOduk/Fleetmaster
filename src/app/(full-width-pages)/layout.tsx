import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <AdminProvider>
        <div>{children}</div>
      </AdminProvider>
    </TenantProvider>
  );
}
