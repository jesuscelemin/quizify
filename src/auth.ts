/* eslint-disable no-unused-vars */
import NextAuth, { DefaultSession, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import prismadb from './lib/prismadb'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const prisma = new PrismaClient()

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            console.log(email, password)

            const user = await prismadb.user.findUnique({ where: { email } })

            if (!user) return null
            const passwordsMatch = await bcrypt.compare(
              password,
              user.hashedPassword!
            )

            if (passwordsMatch) return user
          }
          console.log('Invalid credentials')
          return null
        } catch (error) {
          console.log(error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token }: any) {
      const user = await prisma.user.findFirst({
        where: {
          email: token?.email
        }
      })

      if (user) {
        token.id = user?.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.img = token.img
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    }
  },
  secret: process.env.AUTH_SECRET
})
