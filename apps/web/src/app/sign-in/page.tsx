"use client"

import SignInForm from "@/components/sign-in-form";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const onSwitchToSignUp = () => {
    router.push('/sign-up' as Route);
  };
  return <SignInForm onSwitchToSignUp={onSwitchToSignUp} />;
}
