"use client";
import { SignUp } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="mx-auto max-w-md p-6">
      <SignUp routing="path" path="/sign-up" forceRedirectUrl="/dashboard" signInUrl="/sign-in" />
    </div>
  );
}

