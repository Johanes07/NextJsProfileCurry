'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// ─── Types ────────────────────────────────────────────────
interface OurStoryData {
    badge: string
    headingLine1: string
    headingLine2: string
    headingLine3: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    stat1Value: string; stat1Label: string
    stat2Value: string; stat2Label: string
    stat3Value: string; stat3Label: string
    hoursValue: string
    hoursLabel1: string
    hoursLabel2: string
    imageUrl: string
    updatedAt?: string
}

const DEFAULT: OurStoryData = {
    badge: 'How It All Started',
    headingLine1: 'FROM A HOME',
    headingLine2: 'KITCHEN TO',
    headingLine3: 'THE WORLD',
    paragraph1: "It started in 2020 when our founder spent an entire weekend perfecting his grandmother's curry recipe. After 100 hours of slow cooking, he discovered something magical — depth of flavor that no shortcut could ever replicate.",
    paragraph2: "What began as a passion project shared with friends quickly grew into Jakarta's most talked-about curry destination. Word spread not through ads, but through the irresistible aroma and unforgettable taste.",
    paragraph3: 'Today, we still follow the same 100-hour process. No compromises. No shortcuts. Just pure, obsessive dedication to the perfect bowl of curry.',
    stat1Value: '2020', stat1Label: 'Founded',
    stat2Value: '3', stat2Label: 'Locations',
    stat3Value: '50K+', stat3Label: 'Bowls Served',
    hoursValue: '100',
    hoursLabel1: 'Hours of dedication',
    hoursLabel2: 'in every single bowl',
    imageUrl: '/images/MAINDISH/AI1.png',
}

// ─── Skeleton ─────────────────────────────────────────────
function OurStorySkeleton({ isDark }: { isDark: boolean }) {
    return (
        <section className={`py-24 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className={`h-[550px] rounded-3xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                    <div className="space-y-4">
                        <div className={`h-7 w-36 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                        <div className={`h-14 w-3/4 rounded-xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                        <div className={`h-14 w-2/3 rounded-xl animate-pulse ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`} />
                        <div className="space-y-2 pt-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-4 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} style={{ width: `${85 - i * 8}%` }} />
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-20 rounded-2xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Component ────────────────────────────────────────────
export function OurStory() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [data, setData] = useState<OurStoryData | null>(null)
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        fetch('/api/admin/our-story', { cache: 'no-store' })
            .then(r => r.json())
            .then((d: Partial<OurStoryData>) => {
                const rawUrl = (d.imageUrl || DEFAULT.imageUrl).split('?')[0]
                const bust = `?v=${d.updatedAt ? new Date(d.updatedAt).getTime() : Date.now()}`
                setData({ ...DEFAULT, ...d, imageUrl: rawUrl + bust })
            })
            .catch(() => setData(DEFAULT))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    if (!data) return <OurStorySkeleton isDark={isDark} />

    const stats = [
        { value: data.stat1Value, label: data.stat1Label },
        { value: data.stat2Value, label: data.stat2Label },
        { value: data.stat3Value, label: data.stat3Label },
    ]

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Image */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden border border-yellow-400/10 h-[550px]">
                            <div className={`absolute inset-0 transition-opacity duration-700 ${imgLoaded ? 'opacity-0' : 'opacity-100'} ${isDark ? 'bg-zinc-800 animate-pulse' : 'bg-gray-100 animate-pulse'}`} />
                            <Image
                                src={data.imageUrl}
                                alt="100 Hours Curry Signature Dish"
                                fill
                                className={`object-cover object-center transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                                unoptimized
                                onLoad={() => setImgLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="bg-yellow-400 rounded-2xl p-6">
                                    <p className="text-black font-black text-3xl">{data.hoursValue}</p>
                                    <p className="text-black/70 font-bold text-sm">{data.hoursLabel1}</p>
                                    <p className="text-black/70 font-bold text-sm">{data.hoursLabel2}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-yellow-400/20">
                            {data.badge}
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {data.headingLine1}
                            <span className="block text-yellow-500">{data.headingLine2}</span>
                            {data.headingLine3}
                        </h2>
                        <div className={`space-y-4 leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                            <p>{data.paragraph1}</p>
                            <p>{data.paragraph2}</p>
                            <p>{data.paragraph3}</p>
                        </div>
                        <div className="mt-10 grid grid-cols-3 gap-4">
                            {stats.map(({ value, label }) => (
                                <div key={label} className={`border border-yellow-400/20 rounded-2xl p-4 text-center ${isDark ? 'bg-yellow-400/5' : 'bg-yellow-50'}`}>
                                    <p className="text-2xl font-black text-yellow-500">{value}</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}