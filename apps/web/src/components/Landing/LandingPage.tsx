import BlurFade from "../magicui/blur-fade"
import TryButton from "./TryButton"
import LandingNavbar from "./LandingNavbar"
const DELAY = 0.04
import heroImage from "../../../public/heroImage.png"
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] justify-center items-center text-white bg-black relative">
      <LandingNavbar />
      <div className="w-full bg-[radial-gradient(circle,_rgba(128,128,128,0.5)_1px,_transparent_1px)] bg-[size:20px_20px]">
        <main className="flex-1 flex flex-col items-center justify-center z-10 px-4 md:px-6 w-full">
          <section className="w-full py-8 md:py-16 lg:py-24 text-left">
            <div className="container mx-auto flex flex-col items-start space-y-6 text-left">
              <div className="space-y-4">
                <div className="text-5xl font-extrabold sm:text-6xl xl:text-7xl tracking-tighter text-white">
                  <BlurFade delay={DELAY}>
                    <span className="hidden lg:inline line" style={{ lineHeight: '1.2' }}>Code from anywhere <br /> with <GradientText/></span>
                    <span className="inline lg:hidden" style={{ lineHeight: '1.1' }}>Code from anywhere with  <GradientText/></span>
                  </BlurFade>
                </div>
                <BlurFade className="max-w-[600px] text-[#666666] md:text-xl" delay={DELAY * 2}>
                  Codeium is a powerful remote code editor that lets you collaborate in real-time, preview your changes
                  instantly, and deploy with ease.
                </BlurFade>
              </div>
              <BlurFade className="flex flex-col gap-2 min-[400px]:flex-row" delay={DELAY * 3}>
                <TryButton />
              </BlurFade>
            </div>
          </section>
        </main>
      </div>
      <HeroImage/>
    </div>
  )
}
function GradientText() {
  return (
    <span className="left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 animate-gradientMove">
      Codeium
    </span>
  );
}

function HeroImage() {
  return (
    <section className="w-full flex justify-center mt-8 md:mt-12 md:px-14 px-2 rounded-md">
      <img
        src={heroImage.src}
        alt="Codeium Screenshot"
        className="w-full h-auto rounded-md  border-2 border-[#2D2D2D] shadow-[0_4px_12px_rgba(255,255,255,0.3)] "
      />
    </section>
  );
}