import NextAuth from "next-auth";
import { cache } from "react";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client, { DB_NAME } from "@/lib/mongodb";

const nextAuth = NextAuth({
  adapter: MongoDBAdapter(client, { databaseName: DB_NAME }),
  // JWT sessions: auth() only decrypts the cookie instead of hitting the
  // database twice per call. The adapter still persists users/accounts.
  session: { strategy: "jwt" },
  providers: [Google],
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

// Dedupe within a request: layout (navbar) and page both call auth().
export const auth = cache(nextAuth.auth);
