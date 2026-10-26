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

const features = [
  {
    step: "Step 1",
    title: "Select Payment Meathod",
    content: "Select the Payment Meathod you prefer Credits get added to your Dashboard",
    image: "/public/Payment.png",
  },
  {
    step: "Step 2",
    title: "Select The Services ",
    content: "Choose from our wide range of services and across 7+ platforms.",
    image: "/public/Choosing.png",
  },
  {
    step: "Step 3",
    title: "Order and Sit Back",
    content: "Let us take care of doing the task,We are legit for a reason.",
    image: "/public/Beach.png",
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

      <LegalFooter />
    </main>
  );
}
