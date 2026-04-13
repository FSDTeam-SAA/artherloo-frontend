import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { loginUser } from "@/services/auth.service"
import type { AuthApiResponse, AuthUser } from "@/types/auth.types"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const response = await loginUser({
          email: credentials.email,
          password: credentials.password,
        })

        const payload = response.data as AuthApiResponse | AuthUser
        const user = ("data" in payload && payload.data ? payload.data : payload) as AuthUser

        if (!user?.accessToken) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.accessToken = user.accessToken
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name ?? ""
        session.user.email = token.email ?? ""
        session.user.role = token.role
        session.user.accessToken = token.accessToken
      }

      return session
    },
  },
}
