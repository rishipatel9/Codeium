import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import { Usr } from "@/types";
import { signIn } from "next-auth/react";

const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_SECRET,
  pages: {
    signIn: "/signup",
    error: "/auth/error",
  },
  callbacks: {
    async redirect() {
      return "/session";
    },
  },
  events: {
    async signIn({ user, account }:{user:Usr,account:any}) {
      try {
        console.log(user);
        console.log(account);
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email || "",
          },
        });
        if (!existingUser) {
          const createdUser = await prisma.user.create({
            data: {
              email: user.email || "",
              name: user.name || "", 
            },
          });
          console.log("User created:", createdUser);
        } else {
          console.log("User already exists:", existingUser);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("User creation failed");
      }
    },
  },
  signIn:{
    async signIn(user: Usr, account: any, profile: any): Promise<boolean> {
      console.log(user);
      console.log(account);
      console.log(profile);
      if (account.provider === "google" || account.provider === "github") {
      return true;
      }
      return false;
    },
  }
};

export { NEXT_AUTH };
