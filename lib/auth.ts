import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const DEMO_EMAIL = process.env.DEMO_MANAGER_EMAIL || "manager@solomonstays.co.ke";
const DEMO_PASSWORD = process.env.DEMO_MANAGER_PASSWORD || "solomon2026";

const MANAGED_PROPERTIES = ["Demo Hotel, Nairobi", "Demo Hotel, Diani"];

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "solomon-stays-local-development-secret",
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "solomon-stays-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "solomon-stays-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "credentials",
      name: "Hotel manager sign in",
      credentials: {
        email: { label: "Work email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const isDemoManager = email.toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD;
        const isTeamMember =
          email.toLowerCase().endsWith("@solomonstays.co.ke") && password.length >= 6;

        if (!isDemoManager && !isTeamMember) return null;

        return {
          id: `usr_${Buffer.from(email).toString("hex").slice(0, 12)}`,
          name: isDemoManager ? "Wanjiku Kamau" : "Solomon Stays Manager",
          email,
          role: "hotel-manager",
          properties: MANAGED_PROPERTIES,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role ?? "hotel-manager";
        token.properties = user.properties ?? MANAGED_PROPERTIES;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: typeof token.id === "string" ? token.id : undefined,
        role: typeof token.role === "string" ? token.role : "hotel-manager",
        properties: Array.isArray(token.properties) ? (token.properties as string[]) : MANAGED_PROPERTIES,
      },
    }),
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
