import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { fetchTenantDetails } from "@/app/actions/tenant";

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || null;

export async function getAdminTenant() {
  let tenantData: unknown = null;
  let tenantId: string | null = null;

  // If header not present, try to derive tenant from server session cookie (for admin pages)
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session")?.value;

    if (sessionCookie && JWT_SECRET) {
      try {
        const decoded = jwt.verify(sessionCookie, JWT_SECRET);
        const derivedTenantId =
          typeof decoded === "string"
            ? null
            : decoded?.tenant_id || decoded?.tenantId || null;

        if (derivedTenantId) {
          tenantId = derivedTenantId;

          const { data: tenant, error } = await fetchTenantDetails(tenantId);

          if (!error && tenant) {
            tenantData = tenant;
            return { tenantId, tenantData };
          }
        }
      } catch (e) {
        // verification failed; ignore and fallback
        console.warn(
          "Failed to verify session cookie for tenant derivation:",
          e,
        );
      }
    }
  } catch (e) {
    console.error("Error while reading cookies for tenant derivation:", e);
  }

  // Final fallback: return whatever we have (likely nulls)
  return { tenantId, tenantData };
}
