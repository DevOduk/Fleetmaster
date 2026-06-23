// [tenant]/(auth)/signin/page.tsx

"use client"
import SignInForm from "@/components/auth/SignInForm";

export default function SignIn() {

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Handle local testing environments safely
  let slug = parts.length > 1 ? parts[0] : null;
  console.log('slug ', slug);

  return <SignInForm tenant={slug} />;
}
