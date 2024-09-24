import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

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
    signUp: "/signup",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      const userExists = await prisma.user.findFirst({
        where: {
          email: session.user.email,
        },
      });

      if (userExists && userExists.provider !== token.provider) {
        throw new Error(
          `You have previously signed in with ${userExists.provider}. Please use ${userExists.provider} to sign in.`,
        );
      }

      session.user.id = token.id;
      session.user.provider = token.provider;
      return session;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      if (user) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
  },

};



export { NEXT_AUTH };
