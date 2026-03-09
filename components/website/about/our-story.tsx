'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function OurStory() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden border border-yellow-400/10 h-[550px]">
                            <Image src="/images/MAINDISH/AI1.png" alt="100 Hours Curry Signature Dish" fill className="object-cover object-center" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="bg-yellow-400 rounded-2xl p-6">
                                    <p className="text-black font-black text-3xl">100</p>
                                    <p className="text-black/70 font-bold text-sm">Hours of dedication</p>
                                    <p className="text-black/70 font-bold text-sm">in every single bowl</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className={`inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-yellow-400/20`}>How It All Started</span>
                        <h2 className={`text-4xl md:text-5xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            FROM A HOME
                            <span className="block text-yellow-500">KITCHEN TO</span>
                            THE WORLD
                        </h2>
                        <div className={`space-y-4 leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                            <p>It started in 2020 when our founder spent an entire weekend perfecting his grandmother's curry recipe. After 100 hours of slow cooking, he discovered something magical — depth of flavor that no shortcut could ever replicate.</p>
                            <p>What began as a passion project shared with friends quickly grew into Jakarta's most talked-about curry destination. Word spread not through ads, but through the irresistible aroma and unforgettable taste.</p>
                            <p>Today, we still follow the same 100-hour process. No compromises. No shortcuts. Just pure, obsessive dedication to the perfect bowl of curry.</p>
                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-4">
                            {[{ value: '2020', label: 'Founded' }, { value: '3', label: 'Locations' }, { value: '50K+', label: 'Bowls Served' }].map(({ value, label }) => (
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