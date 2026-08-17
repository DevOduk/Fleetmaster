"use client";
import ResetPasswordForm from "@/components/auth/ResetPassword";
import { useTenant } from "@/context/TenantContext";

export default function ClientResetPassWrapper() {
  const { tenant } = useTenant();

  return <ResetPasswordForm isClient={true} tenantId={tenant.id} />;
}
