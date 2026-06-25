"use client"

import SignUpForm from "@/components/sign-up-form";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const onSwitchToSignIn = () => {
    router.push("/sign-up" as Route);
  };

  return <SignUpForm onSwitchToSignIn={onSwitchToSignIn} />;
}
