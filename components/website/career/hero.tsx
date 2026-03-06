'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Briefcase } from 'lucide-react'

export function CareerHero() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <section className="relative min-h-[60vh] overflow-hidden bg-black flex items-center">
            <div className="absolute inset-0">
                <Image
                    src="/images/chef.jpg"
                    alt="Career Hero"
                    fill
                    className="object-cover opacity-70"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
                <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-8">
                        <Briefcase className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold tracking-wider">JOIN THE TEAM</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
                        WORK WITH
                        <span className="block text-yellow-400">US</span>
                    </h1>
                    <p className="text-white/50 text-xl max-w-xl leading-relaxed">
                        Be part of something obsessive. We are always looking for passionate people who love food as much as we do.
                    </p>
                </div>
            </div>
        </section>
    )
}