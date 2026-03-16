import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                try {
                    console.log('Mencari user:', credentials.username)

                    const user = await prisma.user.findFirst({
                        where: { name: credentials.username },
                    })

                    console.log('User ditemukan:', user)

                    if (!user) return null

                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    console.log('Password valid:', isValid)

                    if (!isValid) return null

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                } catch (error) {
                    console.error('ERROR AUTH:', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = (user as any).role
            return token
        },
        session({ session, token }) {
            if (session.user) (session.user as any).role = token.role
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    session: { strategy: 'jwt' },
    debug: true,
}