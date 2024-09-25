import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BlurFade from "../magicui/blur-fade"
import SignupButtons from "./SignupButtons"

export function Signup() {
  return (
    <BlurFade delay={0.2} className="flex min-h-[100dvh] items-center justify-center bg-background  px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8 border p-4 border-[#7f7ff5] rounded-md shadow-sm shadow-[#7f7ff5] ">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Create your account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link href="#" className="font-medium text-primary hover:text-primary/80" prefetch={false}>
              login to your existing account
            </Link>
          </p>
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email address
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="text-white">
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#7f7ff5]  py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign up
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted " />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground z-10 bg-white">Or continue with</span>
          </div>
        </div>
        <div className="flex gap-2">
        <SignupButtons/>
        </div>
      </div>
    </BlurFade>
  )
}

