"use client";
import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="mx-auto max-w-md p-6">
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/dashboard" signUpUrl="/sign-up" />
    </div>
  );
}

