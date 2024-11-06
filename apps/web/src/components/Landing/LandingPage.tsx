import BlurFade from "../magicui/blur-fade";
import TryButton from "./TryButton";
import LandingNavbar from "./LandingNavbar";

const DELAY = 0.04;

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] justify-center items-center text-white bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)] bg-size-[20px_20px]"></div> 
      <LandingNavbar />
      <main className="flex-1 flex flex-col items-center justify-center z-10 px-4 md:px-6">
        <section className="w-full py-8 md:py-16 lg:py-24 text-left">
          <div className="container mx-auto flex flex-col items-start space-y-6 text-left">
            <div className="space-y-4">
              <BlurFade className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl text-white" delay={DELAY}>
                Code from anywhere with Codeium
              </BlurFade>
              <BlurFade className="max-w-[600px] text-[#666666] md:text-xl" delay={DELAY * 2}>
                Codeium is a powerful remote code editor that lets you collaborate in real-time, preview your changes instantly, and deploy with ease.
              </BlurFade>
            </div>
            <BlurFade className="flex flex-col gap-2 min-[400px]:flex-row" delay={DELAY * 3}>
              <TryButton />
            </BlurFade>
          </div>
        </section>
        <section className="w-full flex justify-center mt-8 md:mt-16">
          <img
            src="https://i.ibb.co/C1dKg1C/Screenshot-2024-11-06-at-5-59-43-PM.png"
            alt="Codeium Screenshot"
            className="w-full h-auto"
          />
        </section>
      </main>
    </div>
  );
}
