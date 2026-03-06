'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError('Email atau password salah!')
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Company Profile</h1>
                    <p className="text-slate-400 mt-1">Admin Panel</p>
                </div>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-white">Masuk</CardTitle>
                        <CardDescription className="text-slate-400">
                            Masukkan kredensial admin kamu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-500 text-sm mt-6">
                    © 2024 Company Profile. All rights reserved.
                </p>
            </div>
        </div>
    )
}