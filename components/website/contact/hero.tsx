'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { useTheme } from 'next-themes'

function useStagger(count: number, delay = 130, startDelay = 120) {
    const [v, setV] = useState<boolean[]>(Array(count).fill(false))
    useEffect(() => {
        const timers = Array.from({ length: count }, (_, i) =>
            setTimeout(() => setV(prev => { const n = [...prev]; n[i] = true; return n }), startDelay + i * delay)
        )
        return () => timers.forEach(clearTimeout)
    }, [])
    return v
}

const fadeUp = (visible: boolean, extra = '') =>
    `transition-all duration-700 ease-out ${extra} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

interface ContactHeroData {
    badgeText: string
    headingLine1: string
    headingLine2: string
    subtitle: string
    imageUrl: string
}

const DEFAULT: ContactHeroData = {
    badgeText: 'FIND US',
    headingLine1: 'GET IN',
    headingLine2: 'TOUCH',
    subtitle: 'Have a question? Want to reserve a table? We would love to hear from you.',
    imageUrl: '/images/MAINDISH/AI3.png',
}

export function ContactHero() {
    const [mounted, setMounted] = useState(false)
    const [data, setData] = useState<ContactHeroData>(DEFAULT)
    const { resolvedTheme } = useTheme()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        fetch('/api/admin/contact/hero')
            .then(r => r.json())
            .then(d => setData(d))
            .catch(() => {/* fallback ke DEFAULT */ })
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true
    const v = useStagger(4)

    // ── DARK MODE ────────────────────────────────────────────────
    if (!mounted || isDark) {
        return (
            <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
                <div className="absolute inset-0">
                    <Image src={data.imageUrl} alt="Contact Hero" fill className="object-cover opacity-50" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                    <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-bold tracking-wider">{data.badgeText}</span>
                        </div>
                    </div>

                    <div className={fadeUp(v[1], 'mb-6')}>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                            {data.headingLine1}
                            <span className="block text-yellow-400">{data.headingLine2}</span>
                        </h1>
                    </div>

                    <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                        <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                        <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                    </div>

                    <div className={fadeUp(v[3])}>
                        <p className="text-white/50 text-xl max-w-xl leading-relaxed">
                            {data.subtitle}
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    // ── LIGHT MODE ───────────────────────────────────────────────
    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-amber-50 flex items-center">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-300/20 rounded-full blur-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                <Image src={data.imageUrl} alt="Contact Hero" fill className="object-cover object-center opacity-100" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-50/60 to-transparent" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                        <MapPin className="w-4 h-4 text-black" />
                        <span className="text-black text-sm font-black tracking-wider">{data.badgeText}</span>
                    </div>
                </div>

                <div className={fadeUp(v[1], 'mb-6')}>
                    <h1 className="text-6xl md:text-8xl font-black leading-none">
                        <span className="text-gray-900">{data.headingLine1}</span>
                        <span className="block text-yellow-500">{data.headingLine2}</span>
                    </h1>
                </div>

                <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                    <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                </div>

                <div className={fadeUp(v[3])}>
                    <p className="text-gray-500 text-xl max-w-xl leading-relaxed">
                        {data.subtitle}
                    </p>
                </div>
            </div>
        </section>
    )
}