"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@movie-ticket-booking/ui/components/button";
import { Input } from "@movie-ticket-booking/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@movie-ticket-booking/ui/components/card";
import { redirect } from "next/navigation";
import type { Route } from "next";

export default function AuthPage() {
  const { data: session, isPending, error } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/movies",
      });
    } else {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/movies",
      });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/movies",
    });
  };

  if (session) {
    redirect("/movies" as Route)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your details to register"
              : "Enter your email to sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-3">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          {/* <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-muted" />
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-muted" />
          </div> */}

          {/* <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Continue with Google
          </Button> */}

          <div className="text-center text-sm hover:cursor-pointer">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
