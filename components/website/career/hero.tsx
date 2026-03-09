'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Briefcase } from 'lucide-react'
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

export function CareerHero() {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()
    useEffect(() => { setMounted(true) }, [])
    const isDark = mounted ? resolvedTheme === 'dark' : true
    const v = useStagger(5)

    // ── DARK MODE (original, unchanged) ─────────────────────────
    if (!mounted || isDark) {
        return (
            <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
                <div className="absolute inset-0">
                    <Image src="/images/chef.jpg" alt="Career Hero" fill className="object-cover opacity-70" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                    <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                            <Briefcase className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-bold tracking-wider">JOIN THE TEAM</span>
                        </div>
                    </div>

                    <div className={fadeUp(v[1], 'mb-6')}>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                            WORK WITH<span className="block text-yellow-400">US</span>
                        </h1>
                    </div>

                    <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                        <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                        <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                    </div>

                    <div className={fadeUp(v[3], 'mb-10')}>
                        <p className="text-white/50 text-xl max-w-xl leading-relaxed">
                            Be part of something obsessive. We are always looking for passionate people who love food as much as we do.
                        </p>
                    </div>

                    <div className={fadeUp(v[4], 'flex gap-8')}>
                        {[{ value: '5', label: 'Open positions' }, { value: '20+', label: 'Team members' }, { value: '2020', label: 'Est. Jakarta' }].map(({ value, label }) => (
                            <div key={label}>
                                <p className="text-2xl font-black text-white">{value}</p>
                                <p className="text-xs text-white/30 font-medium mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // ── LIGHT MODE ───────────────────────────────────────────────
    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-amber-50 flex items-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-300/15 rounded-full blur-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                <Image src="/images/chef.jpg" alt="Career Hero" fill className="object-cover object-center opacity-100" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-50/60 to-transparent" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                        <Briefcase className="w-4 h-4 text-black" />
                        <span className="text-black text-sm font-black tracking-wider">JOIN THE TEAM</span>
                    </div>
                </div>

                <div className={fadeUp(v[1], 'mb-6')}>
                    <h1 className="text-6xl md:text-8xl font-black leading-none">
                        <span className="text-gray-900">WORK WITH</span>
                        <span className="block text-yellow-500">US</span>
                    </h1>
                </div>

                <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                    <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                </div>

                <div className={fadeUp(v[3], 'mb-10')}>
                    <p className="text-gray-500 text-xl max-w-xl leading-relaxed">
                        Be part of something obsessive. We are always looking for passionate people who love food as much as we do.
                    </p>
                </div>
            </div>
        </section>
    )
}