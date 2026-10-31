"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPage } from "@/components/loginpage";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          Welcome back
        </span>
      }
      description={
        error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          "Sign in to your Legit SMM account"
        )
      }
      heroImageSrc="/auth-signup.jpg"
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogle}
      onResetPassword={() => router.push("/auth/forgot-password")}
      onCreateAccount={() => router.push("/auth/sign-up")}
    />
  );
}
