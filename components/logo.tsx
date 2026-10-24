import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Legit SMM home" className="inline-flex items-center">
      <Image
        src="/legit-logo.png"
        alt="Legit SMM"
        width={800}
        height={211}
        priority
        className={`${className} w-auto`}
      />
    </Link>
  );
}
