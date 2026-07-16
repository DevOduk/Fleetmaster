// src/app/client-site/[tenant]/(auth)/signin/page.tsx

import { headers } from "next/headers";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignIn({ 
  params 
}: { 
  params: Promise<{ tenant: string }> 
}) {
  const resolvedParams = await params;
  let tenant = resolvedParams.tenant;

  if (!tenant) {
    const headersList = await headers(); // headers() is also async now
    const host = headersList.get("host") || "";
    const parts = host.split(".");
    if (parts.length > 2) {
       tenant = parts[0];
    }
  }

  return <SignInForm tenant={tenant} />;
}