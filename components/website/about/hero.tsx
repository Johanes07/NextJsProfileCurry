'use client'

import { useEffect, useState } from 'react'
import { Clock, ChefHat } from 'lucide-react'
import Image from 'next/image'
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

export function AboutHero() {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()
    useEffect(() => { setMounted(true) }, [])
    const isDark = mounted ? resolvedTheme === 'dark' : true
    const v = useStagger(5)

    // ── DARK MODE (original, unchanged) ─────────────────────────
    if (!mounted || isDark) {
        return (
            <section className="relative min-h-[70vh] overflow-hidden bg-black flex items-center">
                <div className="absolute inset-0">
                    <Image src="/images/MAINDISH/AI8.png" alt="About Hero" fill className="object-cover opacity-50" priority />
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/60" />
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                    <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                            <ChefHat className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-bold tracking-wider">OUR STORY</span>
                        </div>
                    </div>

                    <div className={fadeUp(v[1], 'mb-6')}>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                            ABOUT<span className="block text-yellow-400">100HOURS</span>
                        </h1>
                    </div>

                    <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                        <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                        <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                    </div>

                    <div className={fadeUp(v[3], 'mb-10')}>
                        <p className="text-white/50 text-xl max-w-2xl leading-relaxed">
                            Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.
                        </p>
                    </div>

                    <div className={fadeUp(v[4], 'flex gap-8')}>
                        {[{ value: '100', label: 'Hours per batch' }, { value: '2020', label: 'Est. Jakarta' }, { value: '50K+', label: 'Bowls served' }].map(({ value, label }) => (
                            <div key={label}>
                                <p className="text-2xl font-black text-white">{value}</p>
                                <p className="text-xs text-white/30 font-medium mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-12 right-12 hidden md:block">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <defs><path id="circle-dark" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs>
                                    <text fontSize="10.5" fontWeight="bold" fill="black" letterSpacing="2">
                                        <textPath href="#circle-dark">CRAFTED WITH PASSION • EST 2020 •</textPath>
                                    </text>
                                </svg>
                            </div>
                            <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center">
                                <Clock className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ── LIGHT MODE ───────────────────────────────────────────────
    return (
        <section className="relative min-h-[70vh] overflow-hidden bg-amber-50 flex items-center">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-300/20 rounded-full blur-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                <Image src="/images/MAINDISH/AI8.png" alt="About Hero" fill className="object-cover object-center opacity-100" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-50/70 to-transparent" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                        <ChefHat className="w-4 h-4 text-black" />
                        <span className="text-black text-sm font-black tracking-wider">OUR STORY</span>
                    </div>
                </div>

                <div className={fadeUp(v[1], 'mb-6')}>
                    <h1 className="text-6xl md:text-8xl font-black leading-none">
                        <span className="text-gray-900">ABOUT</span>
                        <span className="block text-yellow-500">100HOURS</span>
                    </h1>
                </div>

                <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                    <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                </div>

                <div className={fadeUp(v[3], 'mb-10')}>
                    <p className="text-gray-500 text-xl max-w-xl leading-relaxed">
                        Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.
                    </p>
                </div>

                <div className={fadeUp(v[4], 'flex gap-8')}>
                    {[{ value: '100', label: 'Hours per batch' }, { value: '2020', label: 'Est. Jakarta' }, { value: '50K+', label: 'Bowls served' }].map(({ value, label }) => (
                        <div key={label}>
                            <p className="text-2xl font-black text-gray-900">{value}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-12 right-12 hidden md:block">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-gray-900 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs><path id="circle-light" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs>
                            <text fontSize="10.5" fontWeight="bold" fill="#facc15" letterSpacing="2">
                                <textPath href="#circle-light">CRAFTED WITH PASSION • EST 2020 •</textPath>
                            </text>
                        </svg>
                    </div>
                    <div className="absolute inset-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Clock className="w-8 h-8 text-black" />
                    </div>
                </div>
            </div>
        </section>
    )
}