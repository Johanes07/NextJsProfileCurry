'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Star, Flame } from 'lucide-react'

type HeroData = {
    badgeText: string
    headingLine1: string
    headingLine2: string
    headingLine3: string
    subtitle: string
    estYear: string
    stat1Value: string
    stat1Label: string
    stat1Suffix: string
    stat2Value: string
    stat2Label: string
    stat2Suffix: string
    stat3Value: string
    stat3Label: string
    stat3Suffix: string
}

const defaultHero: HeroData = {
    badgeText: 'SIMMERED FOR 100 HOURS',
    headingLine1: 'THE MOST',
    headingLine2: 'LEGENDARY',
    headingLine3: 'CURRY',
    subtitle: "Every bowl is a masterpiece. We slow-cook our signature curry for exactly 100 hours to achieve the deepest, most complex flavors you've ever tasted.",
    estYear: '2020',
    stat1Value: '100', stat1Label: 'Hours Cooked', stat1Suffix: 'hrs',
    stat2Value: '4.9', stat2Label: 'Rating', stat2Suffix: '★',
    stat3Value: '50K+', stat3Label: 'Bowls Served', stat3Suffix: '',
}

export function HeroSection() {
    const [mounted, setMounted] = useState(false)
    const [hero, setHero] = useState<HeroData>(defaultHero)

    useEffect(() => {
        setMounted(true)
        fetch('/api/website/hero')
            .then(res => res.json())
            .then(data => { if (data && data.badgeText) setHero(data) })
            .catch(() => { })
    }, [])

    const stats = [
        { value: hero.stat1Value, label: hero.stat1Label, suffix: hero.stat1Suffix },
        { value: hero.stat2Value, label: hero.stat2Label, suffix: hero.stat2Suffix },
        { value: hero.stat3Value, label: hero.stat3Label, suffix: hero.stat3Suffix },
    ]

    return (
        <section className="relative min-h-screen overflow-hidden bg-black">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/40 via-black to-black" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-3xl" />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-32 left-10 animate-bounce delay-300 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                </div>
            </div>
            <div className="absolute top-48 right-16 animate-bounce delay-700 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Flame className="w-5 h-5 text-orange-400" />
                </div>
            </div>
            <div className="absolute bottom-48 right-10 animate-bounce delay-500 hidden md:block">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center max-w-4xl mx-auto">

                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold tracking-wider">{hero.badgeText}</span>
                    </div>

                    {/* Heading */}
                    <h1 className={`text-6xl md:text-8xl font-black text-white leading-none mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="block">{hero.headingLine1}</span>
                        <span className="block text-yellow-400">{hero.headingLine2}</span>
                        <span className="block">{hero.headingLine3}</span>
                    </h1>

                    {/* Divider */}
                    <div className={`flex items-center justify-center gap-4 mb-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-px bg-yellow-400/30 w-24" />
                        <span className="text-yellow-400 text-sm font-bold tracking-widest">EST. {hero.estYear}</span>
                        <div className="h-px bg-yellow-400/30 w-24" />
                    </div>

                    {/* Subtitle */}
                    <p className={`text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {hero.subtitle}
                    </p>

                    {/* CTA */}
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Link href="/services" className="group inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105 transition-all duration-300">
                            View Our Menu
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-yellow-400/30 transition-all duration-300">
                            Our Story
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className={`mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {stats.map(({ value, label, suffix }) => (
                            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-yellow-400/30 transition-all">
                                <p className="text-3xl font-black text-yellow-400">{value}<span className="text-lg">{suffix}</span></p>
                                <p className="text-white/40 text-xs mt-1 font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    )
}