'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type SectionMeta = {
    badge: string
    headingLine1: string
    headingLine2: string
    heroImage: string
    heroTagline1: string
    heroTagline2: string
    ctaTitle: string
    ctaDesc: string
    ctaButtonLabel: string
    ctaButtonLink: string
}

export function OurTeam() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [meta, setMeta] = useState<SectionMeta | null>(null)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        fetch('/api/admin/team')
            .then(r => r.json())
            .then(json => { if (json.success && json.meta) setMeta(json.meta) })
            .catch(() => {/* silently fail, render dengan fallback */ })
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    // Fallback defaults supaya tidak blank saat data belum datang
    const badge = meta?.badge ?? 'The People Behind The Curry'
    const headingLine1 = meta?.headingLine1 ?? 'MEET THE'
    const headingLine2 = meta?.headingLine2 ?? 'TEAM'
    const heroImage = meta?.heroImage ?? '/images/chef.jpg'
    const heroTagline1 = meta?.heroTagline1 ?? 'The People Who Make'
    const heroTagline2 = meta?.heroTagline2 ?? 'Every Bowl Perfect'
    const ctaTitle = meta?.ctaTitle ?? 'JOIN OUR TEAM'
    const ctaDesc = meta?.ctaDesc ?? "Passionate about food? We're always looking for talented people who share our obsession."
    const ctaButtonLabel = meta?.ctaButtonLabel ?? 'Get In Touch'
    const ctaButtonLink = meta?.ctaButtonLink ?? '/contact'

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">
                        {badge}
                    </span>
                    <h2 className={`text-4xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {headingLine1}
                        <span className="block text-yellow-500">{headingLine2}</span>
                    </h2>
                </div>

                {/* Hero Image */}
                <div className="relative rounded-3xl overflow-hidden border border-yellow-400/20 mb-12">
                    <div className="relative h-[500px]">
                        <Image src={heroImage} alt="100 Hours Curry Team" fill className="object-cover object-center" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <p className="text-yellow-400 font-bold text-sm mb-2 tracking-widest">OUR CREW</p>
                                    <h3 className="text-3xl md:text-4xl font-black text-white">{heroTagline1}</h3>
                                    <h3 className="text-3xl md:text-4xl font-black text-yellow-400">{heroTagline2}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-yellow-400 rounded-3xl p-12">
                    <h3 className="text-3xl md:text-4xl font-black text-black mb-4">{ctaTitle}</h3>
                    <p className="text-black/60 mb-8 max-w-md mx-auto">{ctaDesc}</p>
                    <a
                        href={ctaButtonLink}
                        className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all duration-300"
                    >
                        {ctaButtonLabel}
                    </a>
                </div>

            </div>
        </section>
    )
}