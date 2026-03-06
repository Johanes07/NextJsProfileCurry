'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Flame } from 'lucide-react'

export function MenuHero() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
            <div className="absolute inset-0">
                <Image
                    src="/images/MAINDISH/AI1.png"
                    alt="Menu Hero"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8">
                        <Flame className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold tracking-wider">CRAFTED WITH OBSESSION</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
                        OUR
                        <span className="block text-yellow-400">MENU</span>
                    </h1>
                    <p className="text-white/50 text-xl max-w-xl leading-relaxed">
                        Every dish slow-cooked to perfection. Choose your curry, choose your adventure.
                    </p>
                </div>
            </div>
        </section>
    )
}