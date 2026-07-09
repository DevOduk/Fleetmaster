import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Mock function to simulate a database check
async function getTenantData(slug: string) {
  const validTenants = ["oduk", "fleet-pro", "cargo-corp"];
  if (!validTenants.includes(slug)) return null;
  return { name: slug.toUpperCase() };
}


export const metadata: Metadata = {
  title: "SignUp | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

export default async function SignUp() {
  return <SignUpForm />;
}
