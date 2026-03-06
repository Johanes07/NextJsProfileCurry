'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

export function ContactHero() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
            <div className="absolute inset-0">
                <Image
                    src="/images/MAINDISH/AI3.png"
                    alt="Contact Hero"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold tracking-wider">FIND US</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
                        GET IN
                        <span className="block text-yellow-400">TOUCH</span>
                    </h1>
                    <p className="text-white/50 text-xl max-w-xl leading-relaxed">
                        Have a question? Want to reserve a table? We would love to hear from you.
                    </p>
                </div>
            </div>
        </section>
    )
}