import Link from "next/link";
import BlurFade from "./magicui/blur-fade";
import TryButton from "./TryButton";
const DELAY=0.04;

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] justify-center items-center text-center bg-white text-[#7f7ff5] bg-dot-pattern ">
      <header className="w-full flex justify-center items-center px-4 lg:px-6 h-14 border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <CodeIcon className="h-6 w-6" />
          <span className="font-bold text-xl">Codeium</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#7f7ff5] text-white bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 flex flex-col justify-center items-center">
              <BlurFade className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none" delay={DELAY}>
                Code from anywhere with Codeium
              </BlurFade>
              <BlurFade className="max-w-[600px] text-muted-foreground md:text-xl text-center " delay={DELAY*2}>
                Codeium is a powerful remote code editor that lets you collaborate in real-time, preview your changes
                instantly, and deploy with ease.
              </BlurFade>
            </div>
            <BlurFade className="flex flex-col gap-2 min-[400px]:flex-row w-full justify-center" delay={DELAY*3}>
             <TryButton/>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </BlurFade>
          </div>
        </section>
      </main>
    </div>
  );
}

function CodeIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
