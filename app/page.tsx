import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Grainient from "@/components/gradient";
import TechText from '@/components/headtxt';
import { DrawCircleText } from "@/components/circletxt"; 
import { FeatureSteps } from "@/components/steps";

const features = [
  { 
    step: 'Step 1', 
    title: 'Learn the Basics',
    content: 'Start your Web3 journey by learning the basics of blockchain.', 
    image: 'https://cdn.21st.dev/assets/mirror/ba/ba157d049e59513a30a7d4ec04fc9ea8af159f81cc9e54700ed127889b91d967.jpg' 
  },
  { 
    step: 'Step 2',
    title: 'Deep Dive',
    content: 'Dive deep into blockchain fundamentals and smart contract development.',
    image: 'https://cdn.21st.dev/assets/mirror/85/85e84077a6db13908b5d28903e8107f131e685fee136869651ae5eccda88a020.jpg'
  },
  { 
    step: 'Step 3',
    title: 'Build Projects',
    content: 'Graduate with hands-on Web3 experience through building decentralized applications.',
    image: 'https://cdn.21st.dev/assets/mirror/f6/f6d1e174377ea631cd11224860ab67347e8cc4844ad94d6d2dee6521b8b5dd55.jpg'
  },
]
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
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
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
            
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
      </div>
        
<div style={{ width: '100%', height: '480px', position: 'relative' }}>
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
      <div className="w-full">
        <DrawCircleText />
      </div>
      <section className="w-full max-w-7xl text-white">
          <Suspense fallback={null}>

        <FeatureSteps
          features={features}
          title="How It Works"
          autoPlayInterval={4000}
        />
            </Suspense>
      </section>

    </main>
   

  );
}
