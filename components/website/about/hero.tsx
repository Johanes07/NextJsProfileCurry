'use client'

import { useEffect, useState } from 'react'
import { Clock, ChefHat } from 'lucide-react'
import Image from 'next/image'

export function AboutHero() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <section className="relative min-h-[70vh] overflow-hidden bg-black flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/MAINDISH/AI8.png"
                    alt="About Hero"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/60" />
            </div>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8">
                        <ChefHat className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold tracking-wider">OUR STORY</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
                        ABOUT
                        <span className="block text-yellow-400">100HOURS</span>
                    </h1>
                    <p className="text-white/50 text-xl max-w-2xl leading-relaxed">
                        Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.
                    </p>
                </div>

                <div className="absolute bottom-12 right-12 hidden md:block">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <defs>
                                    <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                </defs>
                                <text fontSize="10.5" fontWeight="bold" fill="black" letterSpacing="2">
                                    <textPath href="#circle">CRAFTED WITH PASSION • EST 2020 •</textPath>
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