"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Same API as shadcn's Avatar (Avatar / AvatarImage / AvatarFallback), written
 * without @radix-ui/react-avatar so nothing new has to be installed.
 * The fallback shows while there is no image, or if the image fails to load.
 */

type Status = "idle" | "loading" | "loaded" | "error";

const AvatarContext = React.createContext<{
  status: Status;
  setStatus: (s: Status) => void;
}>({ status: "idle", setStatus: () => {} });

const Avatar = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const [status, setStatus] = React.useState<Status>("idle");
  const value = React.useMemo(() => ({ status, setStatus }), [status]);

  return (
    <AvatarContext.Provider value={value}>
      <span
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt = "", ...props }, ref) => {
  const { status, setStatus } = React.useContext(AvatarContext);
  // React 19 types allow `src` to be a Blob; we only support URL strings.
  const url = typeof src === "string" ? src : undefined;

  // Preload so we know whether to show the image or the fallback.
  React.useEffect(() => {
    if (!url) {
      setStatus("error");
      return;
    }
    let active = true;
    setStatus("loading");
    const img = new window.Image();
    img.onload = () => active && setStatus("loaded");
    img.onerror = () => active && setStatus("error");
    img.src = url;
    return () => {
      active = false;
    };
  }, [url, setStatus]);

  if (status !== "loaded") return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={url}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { status } = React.useContext(AvatarContext);

  if (status === "loaded" || status === "loading") return null;

  return (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
