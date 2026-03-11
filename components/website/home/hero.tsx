'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Star, Flame } from 'lucide-react'
import { useTheme } from 'next-themes'

type HeroData = {
    badgeText: string
    headingLine1: string
    headingLine2: string
    headingLine3: string
    subtitle: string
    estYear: string
    stat1Value: string; stat1Label: string; stat1Suffix: string
    stat2Value: string; stat2Label: string; stat2Suffix: string
    stat3Value: string; stat3Label: string; stat3Suffix: string
}

const defaultHero: HeroData = {
    badgeText: 'SIMMERED FOR 100 HOURS',
    headingLine1: 'THE MOST', headingLine2: 'LEGENDARY', headingLine3: 'CURRY',
    subtitle: "Every bowl is a masterpiece. We slow-cook our signature curry for exactly 100 hours to achieve the deepest, most complex flavors you've ever tasted.",
    estYear: '2020',
    stat1Value: '100', stat1Label: 'Hours Cooked', stat1Suffix: 'hrs',
    stat2Value: '4.9', stat2Label: 'Rating', stat2Suffix: '★',
    stat3Value: '50K+', stat3Label: 'Bowls Served', stat3Suffix: '',
}

export function HeroSection() {
    const [mounted, setMounted] = useState(false)
    const [hero, setHero] = useState<HeroData | null>(null) // null = belum load
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
        // ✅ Fix 1: endpoint yang benar
        // ✅ Fix 2: cache: 'no-store' supaya selalu ambil data terbaru
        fetch('/api/admin/hero', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data?.badgeText) setHero(data)
                else setHero(defaultHero)
            })
            .catch(() => setHero(defaultHero))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    // Gunakan defaultHero saat data belum masuk (hindari flicker)
    const h = hero ?? defaultHero

    const stats = [
        { value: h.stat1Value, label: h.stat1Label, suffix: h.stat1Suffix },
        { value: h.stat2Value, label: h.stat2Label, suffix: h.stat2Suffix },
        { value: h.stat3Value, label: h.stat3Label, suffix: h.stat3Suffix },
    ]

    return (
        <section className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-amber-50'}`}>
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-yellow-950/40 via-black to-black' : 'bg-gradient-to-br from-yellow-100/60 via-amber-50 to-white'}`} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-3xl" />
            </div>

            {/* Floating icons */}
            <div className="absolute top-32 left-10 animate-bounce delay-300 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                </div>
            </div>
            <div className="absolute top-48 right-16 animate-bounce delay-700 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Flame className="w-5 h-5 text-orange-400" />
                </div>
            </div>
            <div className="absolute bottom-48 right-10 animate-bounce delay-500 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center max-w-4xl mx-auto">

                    <div className={`inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-bold tracking-wider">{h.badgeText}</span>
                    </div>

                    <h1 className={`text-6xl md:text-8xl font-black leading-none mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span className="block">{h.headingLine1}</span>
                        <span className="block text-yellow-500">{h.headingLine2}</span>
                        <span className="block">{h.headingLine3}</span>
                    </h1>

                    <div className={`flex items-center justify-center gap-4 mb-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-px bg-yellow-400/40 w-24" />
                        <span className="text-yellow-500 text-sm font-bold tracking-widest">EST. {h.estYear}</span>
                        <div className="h-px bg-yellow-400/40 w-24" />
                    </div>

                    <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        {h.subtitle}
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Link href="/services" className="group inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105 transition-all duration-300">
                            View Our Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className={`inline-flex items-center gap-2 border px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-yellow-400/30' : 'bg-black/5 border-black/10 text-gray-800 hover:bg-black/10 hover:border-yellow-500/40'}`}>
                            Our Story
                        </Link>
                    </div>

                    <div className={`mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {stats.map(({ value, label, suffix }) => (
                            <div key={label} className={`border rounded-2xl p-4 hover:border-yellow-400/40 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <p className="text-3xl font-black text-yellow-500">{value}<span className="text-lg">{suffix}</span></p>
                                <p className={`text-xs mt-1 font-medium ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${isDark ? 'from-black' : 'from-amber-50'} to-transparent`} />
        </section>
    )
}