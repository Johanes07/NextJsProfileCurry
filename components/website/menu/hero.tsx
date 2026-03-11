'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Flame } from 'lucide-react'
import { useTheme } from 'next-themes'

// ── Types ─────────────────────────────────────────────────────
interface MenuHeroData {
    badgeText: string
    headingLine1: string
    headingLine2: string
    subtitle: string
    imageUrl?: string | null
    updatedAt?: string
}

const DEFAULT: MenuHeroData = {
    badgeText: 'CRAFTED WITH OBSESSION',
    headingLine1: 'OUR',
    headingLine2: 'MENU',
    subtitle: 'Every dish slow-cooked to perfection. Choose your curry, choose your adventure.',
    imageUrl: '/images/MAINDISH/AI1.png',
}

// ── Stagger hook ──────────────────────────────────────────────
function useStagger(count: number, delay = 130, startDelay = 120) {
    const [v, setV] = useState<boolean[]>(Array(count).fill(false))
    useEffect(() => {
        const timers = Array.from({ length: count }, (_, i) =>
            setTimeout(
                () => setV(prev => { const n = [...prev]; n[i] = true; return n }),
                startDelay + i * delay
            )
        )
        return () => timers.forEach(clearTimeout)
    }, [])
    return v
}

const fadeUp = (visible: boolean, extra = '') =>
    `transition-all duration-700 ease-out ${extra} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

// ── Skeleton ──────────────────────────────────────────────────
function HeroSkeleton() {
    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="mb-6 space-y-3">
                    <div className="h-16 md:h-24 w-40 bg-white/10 rounded-xl animate-pulse" />
                    <div className="h-16 md:h-24 w-64 bg-yellow-400/20 rounded-xl animate-pulse" />
                </div>
                <div className="mb-6 flex items-center gap-4">
                    <div className="h-1 w-16 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-1 w-8 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-96 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-72 bg-white/10 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    )
}

// ── Component ─────────────────────────────────────────────────
export function MenuHero() {
    const [mounted, setMounted] = useState(false)
    const [content, setContent] = useState<MenuHeroData | null>(null) // null = belum load
    const [imgReady, setImgReady] = useState(false)
    const { resolvedTheme } = useTheme()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        fetch('/api/admin/menu/hero', { cache: 'no-store' })
            .then(r => r.json())
            .then((d: MenuHeroData) => {
                const rawUrl = (d.imageUrl || DEFAULT.imageUrl!).split('?')[0]
                const bust = `?v=${d.updatedAt ? new Date(d.updatedAt).getTime() : Date.now()}`
                setContent({
                    badgeText: d.badgeText || DEFAULT.badgeText,
                    headingLine1: d.headingLine1 || DEFAULT.headingLine1,
                    headingLine2: d.headingLine2 || DEFAULT.headingLine2,
                    subtitle: d.subtitle || DEFAULT.subtitle,
                    imageUrl: rawUrl + bust,
                })
            })
            .catch(() => setContent(DEFAULT))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true
    const v = useStagger(4)

    // Tampilkan skeleton sampai data CMS ready
    if (!content) return <HeroSkeleton />

    const img = content.imageUrl || DEFAULT.imageUrl!

    // ── DARK MODE ────────────────────────────────────────────────
    if (!mounted || isDark) {
        return (
            <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
                <div className="absolute inset-0">
                    <div className={`absolute inset-0 bg-zinc-900 transition-opacity duration-700 ${imgReady ? 'opacity-0' : 'opacity-100'}`} />
                    <Image
                        src={img}
                        alt="Menu Hero"
                        fill
                        className={`object-cover transition-opacity duration-700 ${imgReady ? 'opacity-50' : 'opacity-0'}`}
                        priority
                        unoptimized
                        onLoad={() => setImgReady(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                    <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                            <Flame className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-bold tracking-wider">{content.badgeText}</span>
                        </div>
                    </div>

                    <div className={fadeUp(v[1], 'mb-6')}>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                            {content.headingLine1}
                            <span className="block text-yellow-400">{content.headingLine2}</span>
                        </h1>
                    </div>

                    <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                        <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                        <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                    </div>

                    <div className={fadeUp(v[3])}>
                        <p className="text-white/50 text-xl max-w-xl leading-relaxed">{content.subtitle}</p>
                    </div>
                </div>
            </section>
        )
    }

    // ── LIGHT MODE ───────────────────────────────────────────────
    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-amber-50 flex items-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                <div className={`absolute inset-0 bg-amber-100 transition-opacity duration-700 ${imgReady ? 'opacity-0' : 'opacity-100'}`} />
                <Image
                    src={img}
                    alt="Menu Hero"
                    fill
                    className={`object-cover object-center transition-opacity duration-700 ${imgReady ? 'opacity-100' : 'opacity-0'}`}
                    priority
                    unoptimized
                    onLoad={() => setImgReady(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-50/60 to-transparent" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={fadeUp(v[0], 'mb-8 inline-flex')}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                        <Flame className="w-4 h-4 text-black" />
                        <span className="text-black text-sm font-black tracking-wider">{content.badgeText}</span>
                    </div>
                </div>

                <div className={fadeUp(v[1], 'mb-6')}>
                    <h1 className="text-6xl md:text-8xl font-black leading-none">
                        <span className="text-gray-900">{content.headingLine1}</span>
                        <span className="block text-yellow-500">{content.headingLine2}</span>
                    </h1>
                </div>

                <div className={fadeUp(v[2], 'mb-6 flex items-center gap-4')}>
                    <div className="h-1 w-16 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-8 bg-yellow-400/40 rounded-full" />
                </div>

                <div className={fadeUp(v[3])}>
                    <p className="text-gray-500 text-xl max-w-xl leading-relaxed">{content.subtitle}</p>
                </div>
            </div>
        </section>
    )
}