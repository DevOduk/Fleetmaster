import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Mock function to simulate a database check
async function getTenantData(slug: string) {
  const validTenants = ["oduk", "fleet-pro", "cargo-corp"];
  if (!validTenants.includes(slug)) return null;
  return { name: slug.toUpperCase() };
}


export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default async function SignIn({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const tenantData = await getTenantData(tenant);

  if (tenant) {
    // If the subdomain doesn't exist in our list, trigger the 404
    if (!tenantData) {
      notFound();
    }
  }


  return <SignInForm tenant={tenant} />;
}
