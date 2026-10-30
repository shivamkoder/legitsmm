"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: { full_name: formData.name },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400";

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Panel - Image Section */}
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            aria-label="Back to home"
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>

        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth-signup.jpg"
            alt="Legit SMM"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={inputClass}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="m@example.com"
                className={inputClass}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`${inputClass} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Repeat password */}
            <div>
              <label
                htmlFor="repeatPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Repeat Password
              </label>
              <div className="relative">
                <input
                  id="repeatPassword"
                  type={showRepeat ? "text" : "password"}
                  name="repeatPassword"
                  autoComplete="new-password"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  placeholder="Repeat password"
                  className={`${inputClass} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRepeat(!showRepeat)}
                  aria-label={showRepeat ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  {showRepeat ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating an account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
