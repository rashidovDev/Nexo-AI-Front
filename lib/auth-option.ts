import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { connectToDatabase } from './mongoose'
import User from '@/models/user.model'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        qrUserId: { label: 'QR User Id', type: 'text' }, // ✅
      },
      async authorize(credentials) {
        await connectToDatabase()

        // ✅ QR login
        if (credentials?.qrUserId) {
          const user = await User.findById(credentials.qrUserId)
          if (!user) return null
          // console.log("QR LOGIN USER", user)
          return user
        }

        // ✅ Normal login
        if (credentials?.email) {
          const user = await User.findOne({ email: credentials.email })
          // console.log('USER AUTH', user)
          return user
        }

        return null
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session }) {
      // console.log('SESSION CALLBACK', session)
      await connectToDatabase()

      const isExistingUser = await User.findOne({
        email: session.user?.email
      })

      if (!isExistingUser) {
        const user = await User.create({
          email: session.user?.email,
          isVerified: true,
          userImage: {
            url: session.user?.image,
            public_id: ''
          }
        })

        session.currentUser = user
        return session
      }

      session.currentUser = isExistingUser
      return session
    },
  },

  session: { strategy: 'jwt' },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/auth', signOut: '/auth' },
}
