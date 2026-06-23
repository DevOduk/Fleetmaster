import { AdminProvider } from "@/context/AdminContext";
import { TenantProvider } from "@/context/TenantContext";
import { UserProvider } from "@/context/UserContext";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <AdminProvider>
        <UserProvider>
          <div>{children}</div>
        </UserProvider>
      </AdminProvider>
    </TenantProvider>
  )
}
