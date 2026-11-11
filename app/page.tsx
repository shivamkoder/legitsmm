import Link from "next/link";
import { Suspense } from "react";
import Grainient from "@/components/gradient";
import TechText from "@/components/headtxt";
import { DrawCircleText } from "@/components/circletxt";
import { FeatureSteps } from "@/components/steps";
import { Button } from "@/components/ui/button";
import { LegalFooter } from "@/components/legal-footer";
import { Logo } from "@/components/logo";
import { ServicesMenu } from "@/components/services-menu";
import { Affiliates } from "@/components/affiliates";
import { ImageComparison } from "@/components/comparison";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/slides";
import InfoCards from "@/components/info";
import { Reveal2 } from "@/components/differ";
import { ShieldCheck, Zap, Headset } from "lucide-react";

const features = [
  {
    step: "Step 1",
    title: "Select Payment Meathod",
    content: "Select the Payment Meathod you prefer Credits get added to your Dashboard",
    image: "/steps/payment.png",
  },
  {
    step: "Step 2",
    title: "Select The Services ",
    content: "Choose from our wide range of services and across 7+ platforms.",
    image: "/steps/choosing.png",
  },
  {
    step: "Step 3",
    title: "Order and Sit Back",
    content: "Let us take care of doing the task,We are legit for a reason.",
    image: "/steps/beach.png",
  },
];
const slides: SqueezeSlide[] = [
  {
    title: "Instagram growth.",
    description: "Followers, likes, views and reels engagement delivered fast with refill options.",
    background: "linear-gradient(135deg, #feda75, #d62976 55%, #4f5bd5)",
    action: "Order now",
    href: "/auth/sign-up",
  },
  {
    title: "YouTube boosts.",
    description: "Views, watch time and subscribers to help your channel get noticed.",
    background: "linear-gradient(135deg, #7f0000, #ff0000)",
    action: "Order now",
    href: "/auth/sign-up",
  },
  {
    title: "TikTok reach.",
    description: "Likes, views and followers to push your videos further.",
    background: "linear-gradient(135deg, #00f2ea, #111111 50%, #ff0050)",
    action: "Order now",
    href: "/auth/sign-up",
  },
  {
    title: "Telegram communities.",
    description: "Members, post views and reactions for channels and groups.",
    background: "linear-gradient(135deg, #2AABEE, #1b6fa8)",
    action: "Order now",
    href: "/auth/sign-up",
  },
  {
    title: "Spotify & more.",
    description: "Plays, listeners and followers across 7+ platforms in one dashboard.",
    background: "linear-gradient(135deg, #1DB954, #0b3d1d)",
    action: "View services",
    href: "/auth/sign-up",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* HERO: gradient + nav + heading + circled text */}
      <section className="relative w-full flex flex-col items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Grainient
            color1="#000000"
            color2="#7FFF00"
            color3="#000000"
            timeSpeed={0.25}
            grainAmount={0.1}
            zoom={0.9}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent via-black/70 to-black" />

        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
    <Logo className="h-11" />

            <div className="flex items-center gap-4">
              <ServicesMenu />
              <Link
                href="/about"
                className="text-white/80 transition-colors hover:text-[#7FFF00]"
              >
                About Us
              </Link>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div style={{ width: "100%", height: "250px", position: "relative" }}>
          <TechText
            text="Legit SMM"
            fontWeight={600}
            fontSize={150}
            reveal="letter"
            dashLength={4}
            dashGap={2}
            specks={15}
            fontFamily=""
            color="#ffffff"
            accentColor="#ffffff"
            letterSpacing={-0.05}
            reach={200}
            softness={0.7}
            strokeWidth={1.5}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
          />
        </div>

        <div className="w-full pb-24 md:pb-32">
          <DrawCircleText />
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={null}>
            <FeatureSteps
              features={features}
              title="How It Works"
              autoPlayInterval={4000}
            />
          </Suspense>
        </div>
      </section>
      {/* BEFORE / AFTER */}
<section className="w-full bg-black text-white px-5 py-16 md:py-24">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#7FFF00]">
      See the difference
    </h2>
    <p className="mt-3 mb-10 text-center text-white/60 text-sm md:text-base">
      Drag the slider to compare an account before and after Legit SMM.
    </p>
    <ImageComparison
      beforeImage="/compare/before.png"
      afterImage="/compare/after.png"
      altBefore="Profile before Legit SMM"
      altAfter="Profile after Legit SMM"
    />
  </div>
</section>

      {/* PLATFORMS CAROUSEL */}
<section className="w-full bg-black text-white px-5 py-16 md:py-24">
  <div className="dark max-w-5xl mx-auto">
    <h2 className="mb-10 text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#7FFF00]">
      Every platform, one panel
    </h2>
    <SqueezeCarousel
      slides={slides}
      autoplay
      interval={5000}
      accent="#7FFF00"
      accentForeground="#000000"
      label="Supported platforms"
    />
  </div>
</section>
      {/* WHY US */}
      <section className="w-full bg-black text-white px-5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <InfoCards />
        </div>
      </section>
      {/* BEFORE / AFTER */}
<section className="dark w-full bg-black text-white">
  <Reveal2
    badge={{ label: "Compare", variant: "lime" }}
    heading="See the difference"
    description="Drag the slider to compare an account before and after Legit SMM."
    highlights={[
      {
        id: "start",
        icon: <Zap className="size-5 text-[#7FFF00]" />,
        title: "Fast to start",
        description: "Add funds, place an order and it begins processing soon after.",
      },
      {
        id: "pricing",
        icon: <ShieldCheck className="size-5 text-[#7FFF00]" />,
        title: "Clear pricing",
        description: "See the rate per 1000, minimum and maximum before you pay.",
      },
      {
        id: "support",
        icon: <Headset className="size-5 text-[#7FFF00]" />,
        title: "Real support",
        description: "Open a ticket from your dashboard for orders, payments and refills.",
      },
    ]}
    beforeImage={{ src: "/compare/before.png", alt: "Profile before Legit SMM" }}
    afterImage={{ src: "/compare/after.png", alt: "Profile after Legit SMM" }}
    beforeLabel="Before"
    afterLabel="After"
  />
</section>

      <LegalFooter />
    </main>
  );
}
