"use client";

import * as React from "react";
import { useEffect, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ---------- Typewriter ---------- */
function Typewriter({ text, speed = 60 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span>
      {shown}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ---------- Password input with show/hide ---------- */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: string }
>(({ className, label, ...props }, ref) => {
  const id = useId();
  const [show, setShow] = useState(false);

  return (
    <div className="grid w-full gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={show ? "text" : "password"}
          className={cn("pe-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

/* ---------- Shell ---------- */
export function AuthShell({
  children,
  imageSrc,
  quote,
  author = "Legit SMM",
}: {
  children: React.ReactNode;
  imageSrc: string;
  quote: string;
  author?: string;
}) {
  return (
    // "dark" forces your dark CSS variables here so the page matches the dashboard,
    // regardless of the user's system theme.
    <div className="dark min-h-svh w-full bg-background text-foreground md:grid md:grid-cols-2">
      <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[350px]">{children}</div>
      </div>

      <div
        className="relative hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
          <blockquote className="space-y-2 text-center">
            <p className="text-lg font-medium">
              “<Typewriter key={quote} text={quote} />”
            </p>
            <cite className="block text-sm font-light not-italic text-muted-foreground">
              — {author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
