import { AdminProvider } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
    <UserProvider>
  <div>{children}</div>
    </UserProvider>
    </AdminProvider>
  )
}
