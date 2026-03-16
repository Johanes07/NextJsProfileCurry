'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn('credentials', {
            username,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError('Username atau password salah!')
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

            {/* Background image */}
            <Image
                src="/images/bg7.jpg"
                alt="Background"
                fill
                className="object-cover object-center"
                priority
                quality={90}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm">

                {/* Logo & brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-2xl mb-4 shadow-xl shadow-yellow-400/30">
                        <Lock className="w-7 h-7 text-black" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">100HOURS</h1>
                    <p className="text-white/40 text-sm font-bold tracking-widest uppercase mt-0.5">Admin Panel</p>
                </div>

                {/* Form card */}
                <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    <h2 className="text-xl font-black text-white mb-1">Masuk</h2>
                    <p className="text-white/40 text-sm mb-6">Masukkan kredensial admin kamu</p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm
                                        rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-400/50
                                        focus:ring-2 focus:ring-yellow-400/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm
                                        rounded-xl pl-10 pr-11 py-3 focus:outline-none focus:border-yellow-400/50
                                        focus:ring-2 focus:ring-yellow-400/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black py-3.5 rounded-xl
                                font-black text-sm hover:bg-yellow-300 hover:scale-[1.02] transition-all duration-200
                                shadow-lg shadow-yellow-400/20 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed mt-2"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                                : 'Masuk'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                    © {new Date().getFullYear()} 100Hours Curry. All rights reserved.
                </p>
            </div>
        </div>
    )
}